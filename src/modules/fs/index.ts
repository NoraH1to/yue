import { sortDirItemsBySorter } from '@/helper';
import { FileStat } from '@norah1to/webdav';
import {
  IFs,
  ISorter,
  TFsBook,
  TFsBookWithTags,
  TFsDir,
  TFsTag,
  TTagDistribution,
} from './Fs';
import db, { DB, TDbBook } from './indexedDB';
import { isDirectory, isFile } from './webDAV';

/**
 * @transactionDB `bookAndTag`
 */
const getBookHashListByTagId = async (tagID: string) => {
  return (await db.bookAndTag.where({ tagID }).distinct().toArray()).map(
    (v) => v.bookHash,
  );
};

const getTagMapByBookHash = async (hash: string) => {
  const tabList = await db.bookAndTag
    .where('bookHash')
    .equals(hash)
    .primaryKeys();
  const m: Record<string, boolean> = {};
  for (const tab of tabList) {
    // @ts-ignore
    m[tab[1]] = true;
  }
  return m;
};

const dbBook2FsBook = (book: TDbBook): TFsBook => ({
  ...book,
  target: new File([book.target.buffer], book.target.name, {
    type: book.target.type,
  }),
  cover: book?.cover
    ? new Blob([book.cover.buffer], { type: book.cover.type })
    : undefined,
});

const dbBook2fsBookWithTag = async (
  book: TDbBook,
): Promise<TFsBookWithTags> => {
  const m = await getTagMapByBookHash(book.hash);
  return { ...dbBook2FsBook(book), tags: Object.keys(m), tagsMap: m };
};

const fs: IFs = {
  async addBook(book) {
    const hash = await db.transaction('rw', db.books, async () => {
      const addTs = Date.now();
      const [targetBuffer, coverBuffer] = await DB.waitFor(
        Promise.all([
          book.target.arrayBuffer(),
          (async () => (book.cover ? book.cover.arrayBuffer() : undefined))(),
        ]),
      );
      const hash = await db.books.add({
        ...book,
        target: {
          buffer: targetBuffer,
          type: book.target.type,
          name: book.target.name,
        },
        cover: coverBuffer
          ? {
              buffer: coverBuffer,
              type: book.cover!.type,
            }
          : undefined,
        hash: book.hash,
        addTs,
        lastmodTs: addTs,
      });
      return hash;
    });
    return (await DB.waitFor(this.getBookByHash(hash as string)))!;
  },

  async getBooks() {
    return db.transaction('r', db.books, db.bookAndTag, async () => {
      const books = await db.books.toArray();
      return Promise.all(
        books.map((book) => {
          return dbBook2fsBookWithTag(book);
        }),
      );
    });
  },

  async getRecentReadsBooks(limit) {
    return db.transaction('r', db.books, db.bookAndTag, async () => {
      const books = (await db.books.toCollection().sortBy('lastProcess.ts'))
        .reverse()
        .slice(0, limit)
        .filter((book) => !!book.lastProcess.ts);
      return Promise.all(books.map(dbBook2fsBookWithTag));
    });
  },

  async getBookByHash(hash) {
    return db.transaction('r?', db.books, db.bookAndTag, async () => {
      const book = await db.books.get(hash);
      if (!book) return book;
      return dbBook2FsBook(book);
    });
  },

  async getBooksByTag(tagID) {
    return db.transaction('r', db.books, db.bookAndTag, async () => {
      const bookHashList = await DB.waitFor(getBookHashListByTagId(tagID));
      const books = await db.books.bulkGet(bookHashList);
      return Promise.all(
        books.map((book) => {
          return dbBook2fsBookWithTag(book!);
        }),
      );
    });
  },

  async updateBook({ hash, info }) {
    return db.transaction('rw', db.books, db.bookAndTag, async () => {
      const code = await db.books.update(hash, info);
      if (code === 0) throw new Error(`Update book fail, book ${hash} unexist`);
      // 如果更新了 hash 值（从云端导入本地已有的图书），同时更新 tag 关联
      if (info.hash) {
        await db.bookAndTag
          .where({ bookHash: hash })
          .modify({ bookHash: info.hash });
        hash = info.hash;
      }
      return (await DB.waitFor(this.getBookByHash(hash)))!;
    });
  },

  async deleteBook(hash) {
    hash = Array.isArray(hash) ? hash : [hash];
    return db.transaction('rw', db.books, db.bookAndTag, async () => {
      await db.bookAndTag.where('bookHash').anyOf(hash).delete();
      await db.books.bulkDelete(hash as string[]);
    });
  },

  async addBookTag({ hash, tagID }) {
    return db.transaction('rw', db.books, db.bookAndTag, async () => {
      const addTs = Date.now();
      await db.bookAndTag.add({
        bookHash: hash,
        tagID,
        addTs,
        lastmodTs: addTs,
      });
      return (await DB.waitFor(this.getBookByHash(hash)))!;
    });
  },

  async deleteBookTag({ hash, tagID }) {
    return db.transaction('rw', db.books, db.bookAndTag, async () => {
      await db.bookAndTag.where({ bookHash: hash, tagID }).delete();
      return (await DB.waitFor(this.getBookByHash(hash)))!;
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
        console.warn(e);
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
