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

  constructor() {
    super('yue');
    this.version(1).stores({
      books: 'hash,title,author,type,addTs,lastProcess.ts',
      dirs: 'filename',
      tags: 'id,&title,prev,next,addTs',
      bookAndTag: '[bookHash+tagID],bookHash,tagID,addTs',
    });
  }
}

export const db = new DB();

export default db;
