import { md5FromBlob } from '@/helper';
import { Dexie, Table } from 'dexie';
import {
  TDbBook,
  TDbBookAndTag,
  TDbBookContent,
  TDbBookContentV1,
  TDbBookCover,
  TDbBookWithContent,
  TDbDir,
  TDbTags,
} from './types';
export * from './types';

export class DB extends Dexie {
  books!: Table<TDbBook>;
  bookContents!: Table<TDbBookContent>;
  bookCovers!: Table<TDbBookCover>;
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
        const books: TDbBookWithContent[] = await trans
          .table('books')
          .toArray();
        const map: Record<string, TDbBookWithContent> = {};
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
        await DB.waitFor(
          trans
            .table('bookAndTag')
            .toCollection()
            .modify((item: TDbBookAndTag) => {
              item.bookHash = map[item.bookHash].hash;
              return item;
            }),
        );
        return trans
          .table('books')
          .toCollection()
          .modify((book: TDbBook) => {
            book.hash = map[book.hash].hash;
            return book;
          });
      });
    this.version(3)
      .stores({
        books: 'hash,title,author,type,addTs,lastProcess.ts',
        dirs: 'filename',
        tags: 'id,&title,prev,next,addTs',
        bookAndTag: '[bookHash+tagID],bookHash,tagID,addTs',
        sourceIdAndBookHash: '[id+etag+bookHash],[id+etag],id,etag,bookHash',
        bookContents: 'hash',
      })
      .upgrade(async (trans) => {
        const map: Record<string, TDbBookContentV1> = {};
        await DB.waitFor(
          trans
            .table('books')
            .toCollection()
            .modify((item: TDbBookWithContent) => {
              map[item.hash] = {
                hash: item.hash,
                cover: item.cover,
                target: item.target,
                archive: item.archive,
              };
              // @ts-ignore
              if (item.archive) delete item.target.buffer;
              delete item.cover;
              // @ts-ignore
              delete item.target;
              delete item.archive;
              return item;
            }),
        );
        return trans.table('bookContents').bulkAdd(Object.values(map));
      });
    this.version(4)
      .stores({
        books: 'hash,title,author,type,addTs,lastProcess.ts',
        dirs: 'filename',
        tags: 'id,&title,prev,next,addTs',
        bookAndTag: '[bookHash+tagID],bookHash,tagID,addTs',
        sourceIdAndBookHash: '[id+etag+bookHash],[id+etag],id,etag,bookHash',
        bookContents: 'hash',
        bookCovers: 'hash',
      })
      .upgrade(async (trans) => {
        const coverList: TDbBookCover[] = [];
        await DB.waitFor(
          trans
            .table('bookContents')
            .toCollection()
            .modify((item: TDbBookContentV1) => {
              coverList.push({ hash: item.hash, cover: item.cover });
              delete item.cover;
              return item;
            }),
        );
        return trans.table('bookCovers').bulkAdd(coverList);
      });
  }
}

export const db = new DB();

export default db;
