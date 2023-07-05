import { getMimeByExt } from '@/helper';
import db from '.';
import {
  TFsBook,
  TFsBookWithTags,
  TFsBookWithoutContent,
  TFsBookWithoutContentWithTags,
} from '../Fs';
import { TDbBook } from './types';

/**
 * @transactionDB `bookAndTag`
 */
export const getBookHashListByTagId = async (tagID: string) => {
  return (await db.bookAndTag.where({ tagID }).distinct().toArray()).map(
    (v) => v.bookHash,
  );
};

/**
 * @transactionDB `bookAndTag`
 */
export const getTagMapByBookHash = async (hash: string) => {
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

/**
 * @transactionDB `bookContents`, `bookCovers`
 */
export async function dbBook2FsBook(
  book: TDbBook,
  withoutContent?: false,
): Promise<TFsBook>;
export async function dbBook2FsBook(
  book: TDbBook,
  withoutContent: true,
): Promise<TFsBookWithoutContent>;
export async function dbBook2FsBook(
  book: TDbBook,
  withoutContent?: boolean,
): Promise<TFsBook | TFsBookWithoutContent>;
export async function dbBook2FsBook(
  book: TDbBook,
  withoutContent?: boolean,
): Promise<TFsBook | TFsBookWithoutContent> {
  return db.transaction('r', db.bookContents, db.bookCovers, async () => {
    const bookContent = withoutContent
      ? undefined
      : (await db.bookContents.get(book.hash))!;
    const bookCover = (await db.bookCovers.get(book.hash))!;
    const cover = bookCover?.cover
      ? new Blob([bookCover.cover.buffer], { type: bookCover.cover.type })
      : undefined;
    return withoutContent
      ? { ...book, cover }
      : bookContent!.archive
      ? {
          ...book,
          archive: bookContent!.archive,
          target: {
            name: `${book.title}.${book.type}`,
            type: getMimeByExt(book.type) || 'unknown',
          },
          cover,
        }
      : {
          ...book,
          target: new File(
            [bookContent!.target.buffer],
            bookContent!.target.name,
            {
              type: bookContent!.target.type,
            },
          ),
          cover,
        };
  });
}

/**
 * @transactionDB `bookContents`, `bookCovers`, `bookAndTag`
 */
export async function dbBook2fsBookWithTag(
  book: TDbBook,
  withoutContent?: false,
): Promise<TFsBookWithTags>;
export async function dbBook2fsBookWithTag(
  book: TDbBook,
  withoutContent: true,
): Promise<TFsBookWithoutContentWithTags>;
export async function dbBook2fsBookWithTag(
  book: TDbBook,
  withoutContent?: boolean,
): Promise<TFsBookWithTags | TFsBookWithoutContentWithTags> {
  const m = await getTagMapByBookHash(book.hash);
  return {
    ...(await dbBook2FsBook(book, withoutContent)),
    tags: Object.keys(m),
    tagsMap: m,
  };
}
