import { sortDirItemsBySorter } from '@/helper';
import { FileStat } from 'webdav';
import {
  IFs,
  ISorter,
  TFsBook,
  TFsBookWithTags,
  TFsBookWithoutContent,
  TFsBookWithoutContentWithTags,
  TFsDir,
  TFsTag,
  TSourceItemInfo,
  TTagDistribution,
} from './Fs';
import db, { DB } from './indexedDB';
import {
  dbBook2FsBook,
  dbBook2fsBookWithTag,
  getBookHashListByTagId,
} from './indexedDB/helper';
import { isDirectory, isFile } from './webDAV';

async function _getBooks(withoutContent?: false): Promise<TFsBookWithTags[]>;
async function _getBooks(
  withoutContent: true,
): Promise<TFsBookWithoutContentWithTags[]>;
async function _getBooks(
  withoutContent?: boolean,
): Promise<TFsBookWithoutContentWithTags[] | TFsBookWithTags[]> {
  return db.transaction(
    'r!',
    db.books,
    db.bookAndTag,
    db.bookContents,
    db.bookCovers,
    async () => {
      const books = await db.books.toArray();
      return Promise.all(
        books.map((book) => {
          // @ts-ignore
          return dbBook2fsBookWithTag(book, withoutContent);
        }),
      );
    },
  );
}

async function _getRecentReadsBooks(
  limit: number,
  withoutContent?: false,
): Promise<TFsBookWithTags[]>;
async function _getRecentReadsBooks(
  limit: number,
  withoutContent: true,
): Promise<TFsBookWithoutContentWithTags[]>;
async function _getRecentReadsBooks(limit: number, withoutContent?: boolean) {
  return db.transaction(
    'r',
    db.books,
    db.bookAndTag,
    db.bookContents,
    db.bookCovers,
    async () => {
      const books = (await db.books.toCollection().sortBy('lastProcess.ts'))
        .reverse()
        .slice(0, limit)
        .filter((book) => !!book.lastProcess.ts);
      return Promise.all(
        // @ts-ignore
        books.map((book) => dbBook2fsBookWithTag(book, withoutContent)),
      );
    },
  );
}

async function _getBookByHash(
  hash: string,
  withoutContent?: false,
): Promise<TFsBook>;
async function _getBookByHash(
  hash: string,
  withoutContent: true,
): Promise<TFsBookWithoutContent>;
async function _getBookByHash(hash: string, withoutContent?: boolean) {
  return db.transaction(
    'r',
    db.books,
    db.bookAndTag,
    db.bookContents,
    db.bookCovers,
    async () => {
      const book = await db.books.get(hash);
      if (!book) return book;
      return dbBook2FsBook(book, withoutContent);
    },
  );
}

async function _getBookBySourceItemInfo(
  sourceInfo: TSourceItemInfo,
  withoutContent?: false,
): Promise<TFsBook>;
async function _getBookBySourceItemInfo(
  sourceInfo: TSourceItemInfo,
  withoutContent: true,
): Promise<TFsBookWithoutContent>;
async function _getBookBySourceItemInfo(
  sourceInfo: TSourceItemInfo,
  withoutContent?: boolean,
) {
  return db.transaction(
    'r',
    db.books,
    db.sourceIdAndBookHash,
    db.bookContents,
    db.bookCovers,
    async () => {
      const info = await db.sourceIdAndBookHash
        .where({ id: sourceInfo.sourceId, etag: sourceInfo.etag })
        .first();
      if (!info) return info;
      const book = await db.books.get(info.bookHash);
      return book ? dbBook2FsBook(book, withoutContent) : book;
    },
  );
}

async function _getBooksByTag(
  tagID: string,
  withoutContent?: false,
): Promise<TFsBookWithTags[]>;
async function _getBooksByTag(
  tagID: string,
  withoutContent: true,
): Promise<TFsBookWithoutContentWithTags[]>;
async function _getBooksByTag(tagID: string, withoutContent?: boolean) {
  return db.transaction(
    'r',
    db.books,
    db.bookAndTag,
    db.bookContents,
    db.bookCovers,
    async () => {
      const bookHashList = await DB.waitFor(getBookHashListByTagId(tagID));
      const books = await db.books.bulkGet(bookHashList);
      return Promise.all(
        books.map((book) => {
          // @ts-ignore
          return dbBook2fsBookWithTag(book!, withoutContent);
        }),
      );
    },
  );
}

const fs: IFs = {
  async addBook(book, sourceInfo) {
    const hash = await db.transaction(
      'rw',
      db.books,
      db.sourceIdAndBookHash,
      db.bookContents,
      db.bookCovers,
      async () => {
        const addTs = Date.now();
        const [targetBuffer, coverBuffer] = await DB.waitFor(
          Promise.all([
            book.target instanceof File ? book.target.arrayBuffer() : undefined,
            (async () => (book.cover ? book.cover.arrayBuffer() : undefined))(),
          ]),
        );
        const existBook = await db.books.get(book.hash);

        const bookData = {
          ...book,
          hash: book.hash,
          addTs,
          lastmodTs: addTs,
        };
        // @ts-ignore split book content #3
        delete bookData.target;
        delete bookData.cover;
        delete bookData.archive;

        const bookContentData = {
          hash: book.hash,
          target: {
            buffer: book.archive ? undefined : targetBuffer,
            type: book.target.type,
            name: book.target.name,
          },
          archive: book.archive!,
        };
        const bookCoverData = {
          hash: book.hash,
          cover: coverBuffer
            ? {
                buffer: coverBuffer,
                type: book.cover!.type,
              }
            : undefined,
        };

        const hash = existBook ? existBook.hash : book.hash;
        if (!existBook)
          await Promise.all([
            db.books.add(bookData),
            db.bookContents.add(bookContentData),
            db.bookCovers.add(bookCoverData),
          ]);
        if (sourceInfo) {
          try {
            await db.sourceIdAndBookHash.add({
              id: sourceInfo.sourceId,
              etag: sourceInfo.etag,
              bookHash: book.hash,
            });
          } catch {
            // empty
          }
        }
        return hash;
      },
    );
    return (await DB.waitFor(
      this.getBookByHashWithoutContent(hash as string),
    ))!;
  },

  async getBooks() {
    return _getBooks(false);
  },
  async getBooksWithoutContent() {
    return _getBooks(true);
  },

  async getRecentReadsBooks(limit) {
    return _getRecentReadsBooks(limit, false);
  },
  async getRecentReadsBooksWithoutContent(limit) {
    return _getRecentReadsBooks(limit, true);
  },

  async getBookByHash(hash) {
    return _getBookByHash(hash, false);
  },
  async getBookByHashWithoutContent(hash) {
    return _getBookByHash(hash, true);
  },

  async getBookBySourceItemInfo(sourceInfo) {
    return _getBookBySourceItemInfo(sourceInfo, false);
  },
  async getBookBySourceItemInfoWithoutContent(sourceInfo) {
    return _getBookBySourceItemInfo(sourceInfo, true);
  },

  async getBooksByTag(tagID) {
    return _getBooksByTag(tagID, false);
  },
  async getBooksByTagWithoutContent(tagID) {
    return _getBooksByTag(tagID, true);
  },

  async updateBook({ hash, info }) {
    return db.transaction('rw', db.books, async () => {
      const code = await db.books.update(hash, info);
      if (code === 0) throw new Error(`Update book fail, book ${hash} unexist`);
    });
  },

  async deleteBook(hash) {
    hash = Array.isArray(hash) ? hash : [hash];
    return db.transaction(
      'rw',
      db.books,
      db.bookAndTag,
      db.bookContents,
      db.bookCovers,
      async () => {
        await db.bookAndTag.where('bookHash').anyOf(hash).delete();
        await db.books.bulkDelete(hash as string[]);
        await db.bookContents.bulkDelete(hash as string[]);
        await db.bookCovers.bulkDelete(hash as string[]);
      },
    );
  },

  async addBookTag({ hash, tagID }) {
    return db.transaction('rw', db.bookAndTag, async () => {
      const addTs = Date.now();
      try {
        await db.bookAndTag.add({
          bookHash: hash,
          tagID,
          addTs,
          lastmodTs: addTs,
        });
        return true;
      } catch {
        return false;
      }
    });
  },

  async deleteBookTag({ hash, tagID }) {
    return db.transaction('rw', db.bookAndTag, async () => {
      return (
        (await db.bookAndTag.where({ bookHash: hash, tagID }).delete()) !== 0
      );
    });
  },

  async getDir(client, filename, { sorter }) {
    return db.transaction('rw', db.dirs, async () => {
      try {
        const dirInfo = (await DB.waitFor(
          client.getDirectoryContents(filename),
        )) as FileStat[];
        await db.dirs.put({
          filename,
          items: dirInfo.map((d) => {
            const lastmodTs = new Date(d.lastmod).getTime();
            d.filename = d.filename.replaceAll('../', '');
            if (isFile(d)) return { ...d, id: d.etag, lastmodTs };
            else if (isDirectory(d)) return { ...d, id: d.filename, lastmodTs };
            else throw new Error(`Illegal webdav item type ${d.type}`);
          }),
        });
      } catch (e) {
        console.error(e);
      }
      const dir = await db.dirs.get(filename);
      if (!dir) return dir;
      dir.items = sortDirItemsBySorter(dir.items, sorter);
      return dir as TFsDir;
    });
  },

  async addTag(info) {
    return db.transaction('rw', db.tags, async () => {
      const lastTag = await db.tags.where({ next: 'none' }).first();
      const addTs = Date.now();
      const key = await db.tags.add({
        ...info,
        prev: lastTag?.id || 'none',
        next: 'none',
        addTs,
        lastmodTs: addTs,
      });
      if (lastTag) {
        await db.tags.update(lastTag.id, { next: key });
      }
      return (await db.tags.get(key))!;
    });
  },

  async getTags() {
    return db.transaction('r', db.tags, async () => {
      const res: TFsTag[] = [];
      let head = await db.tags.where({ prev: 'none' }).first();
      if (!head) return [];
      do {
        res.push(head);
        head = head.next ? await db.tags.get(head.next) : undefined;
      } while (head);
      return res;
    });
  },

  async getTagByTitle(title) {
    return db.transaction('r', db.tags, async () => {
      return db.tags.where({ title }).first();
    });
  },

  async getTagsByBookHash(hash) {
    return db.transaction('r', db.tags, db.bookAndTag, async () => {
      const tagIdList = (
        await db.bookAndTag.where({ bookHash: hash }).distinct().sortBy('addTs')
      ).map((v) => v.tagID);
      return db.tags.bulkGet(tagIdList) as Promise<TFsTag[]>;
    });
  },

  async getTagById(tagID) {
    return db.tags.get(tagID);
  },

  async updateTag({ id, info }) {
    const code = await db.tags.update(id, info);
    if (code === 0) throw new Error(`Update tag fail, tag ${id} unexist`);
    return (await db.tags.get(id))!;
  },

  async deleteTag(id) {
    return db.transaction('rw', db.tags, db.bookAndTag, async () => {
      const idList = Array.isArray(id) ? id : [id];
      for (const id of idList) {
        const tag = await db.tags.get(id);
        if (!tag) continue;
        await db.tags.where({ id: tag.prev }).modify({ next: tag.next });
        await db.tags.where({ id: tag.next }).modify({ prev: tag.prev });
      }
      for (const id of idList) {
        await db.bookAndTag.where({ tagID: id }).delete();
      }
      await db.tags.bulkDelete(idList);
    });
  },

  async moveTag(sourceID, targetID, sort: ISorter['sort']) {
    await db.transaction('rw', db.tags, async () => {
      const [s, t] = await db.tags.bulkGet([sourceID, targetID]);
      if (!s || !t) return;
      if (sort === 'desc') {
        db.tags.where({ id: s.id }).modify({ next: t.id, prev: t.prev });
        db.tags.where({ id: t.id }).modify({ prev: s.id });
        db.tags.where({ id: t.prev }).modify({ next: s.id });
      } else {
        db.tags.where({ id: s.id }).modify({ next: t.next, prev: t.id });
        db.tags.where({ id: t.id }).modify({ next: s.id });
        db.tags.where({ id: t.next }).modify({ prev: s.id });
      }
      db.tags.where({ id: s.prev }).modify({ next: s.next });
      db.tags.where({ id: s.next }).modify({ prev: s.prev });
    });
  },

  async getTagDistributionByBookHashList(bookHashList) {
    return db.transaction('r', db.tags, db.bookAndTag, async () => {
      // @ts-ignore
      const tags: TTagDistribution[] = await DB.waitFor(this.getTags());
      const map: Record<string, TFsTag> = {};
      tags.forEach((t) => {
        // @ts-ignore
        t.count = 0;
        map[t.id] = t;
      });
      await db.bookAndTag
        .where('bookHash')
        .anyOf(bookHashList)
        // @ts-ignore
        .eachPrimaryKey(([hash, tagId]) => {
          // @ts-ignore
          if (map[tagId]) map[tagId].count++;
        });
      tags.forEach((t) => {
        if (!bookHashList.length) {
          t.distribution = 'none';
          // @ts-ignore
        } else if (t.count === bookHashList.length) {
          t.distribution = 'all';
          // @ts-ignore
        } else if (t.count === 0) {
          t.distribution = 'none';
        } else {
          t.distribution = 'partial';
        }
        // @ts-ignore
        delete t.count;
      });
      return tags;
    });
  },
};

export default fs;
