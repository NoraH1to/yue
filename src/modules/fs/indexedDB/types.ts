import { FilesObject } from 'libarchive.js/src/libarchive';
import { Overwrite } from 'utility-types';
import { TFsBook, TFsDir, TFsTag, TFsBase } from '../Fs';

// #region prev version types
interface TPrevDbBookContentBase {
  hash: string;
  cover?: { buffer: ArrayBuffer; type: string };
}
interface TPrevBookContentWithArchive extends TPrevDbBookContentBase {
  target: { type: string; name: string };
  archive: FilesObject;
}
interface TPrevDbBookContentWithoutArchive extends TPrevDbBookContentBase {
  target: { buffer: ArrayBuffer; type: string; name: string };
  archive?: never;
}
export type TPrevDbBookContent = TPrevBookContentWithArchive | TPrevDbBookContentWithoutArchive;
// #endregion

interface TDbBookContentBase {
  hash: string;
}
interface TDbBookContentWithArchive extends TDbBookContentBase {
  target: { type: string; name: string };
  archive: FilesObject;
}
interface TDbBookContentWithoutArchive extends TDbBookContentBase {
  target: { buffer: ArrayBuffer; type: string; name: string };
  archive?: never;
}
export type TDbBookWithContent = Overwrite<
  TFsBook,
  {
    cover?: { buffer: ArrayBuffer; type: string };
    target: { buffer: ArrayBuffer; type: string; name: string };
  }
>;
export type TDbBook = Omit<TFsBook, 'target' | 'cover' | 'archive'>;
export type TDbBookContent = TDbBookContentWithArchive | TDbBookContentWithoutArchive;

export type TDbBookCover = {
  hash: string;
  cover?: { buffer: ArrayBuffer; type: string };
};

export type TDbDir = TFsDir;

export type TDbTags = TFsTag & { prev: string | 'none'; next: string | 'none' };

export type TDbBookAndTag = { bookHash: string; tagID: string } & TFsBase;
