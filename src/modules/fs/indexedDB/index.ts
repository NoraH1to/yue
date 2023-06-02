import { md5FromBlob } from '@/helper';
import { Dexie, Table } from 'dexie';
import { Overwrite } from 'utility-types';
import { TFsBase, TFsBook, TFsDir, TFsTag } from '../Fs';

export type TDbBook = Overwrite<
  TFsBook,
  {
    cover?: { buffer: ArrayBuffer; type: string };
    target: { buffer: ArrayBuffer; type: string; name: string };
  }
>;
export type TDbDir = TFsDir;
export type TDbTags = TFsTag & { prev: string | 'none'; next: string | 'none' };

type TDbBookAndTag = { bookHash: string; tagID: string } & TFsBase;
export class DB extends Dexie {
  books!: Table<TDbBook>;
  dirs!: Table<TDbDir>;
  tags!: Table<TDbTags>;
  bookAndTag!: Table<TDbBookAndTag>;
  sourceIdAndBookHash!: Table<{ id: string; etag: string; bookHash: string }>;

  constructor() {
    super('yue');
    this.version(1).stores({
      books: 'hash,title,author,type,addTs,lastProcess.ts',
      dirs: 'filename',
      tags: 'id,&title,prev,next,addTs',
      bookAndTag: '[bookHash+tagID],bookHash,tagID,addTs',
    });
    this.version(2)
      .stores({
        books: 'hash,title,author,type,addTs,lastProcess.ts',
        dirs: 'filename',
        tags: 'id,&title,prev,next,addTs',
        bookAndTag: '[bookHash+tagID],bookHash,tagID,addTs',
        sourceIdAndBookHash: '[id+etag+bookHash],[id+etag],id,etag,bookHash',
      })
      .upgrade(async (trans) => {
        const books: TDbBook[] = await trans.table('books').toArray();
        const map: Record<string, TDbBook> = {};
        await DB.waitFor(
          Promise.all(
            books.map((book) =>
              (async () => {
                const oldHash = book.hash;
                book.hash = await md5FromBlob(
                  new Blob([book.target.buffer], { type: book.target.type }),
                );
                map[oldHash] = book;
              })(),
            ),
          ),
        );
        return trans
          .table('books')
          .toCollection()
          .modify((book: TDbBook) => {
            book.hash = map[book.hash].hash;
            return book;
          });
      });
  }
}

export const db = new DB();

export default db;
