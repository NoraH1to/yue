import { FilesObject } from 'libarchive.js/src/libarchive';
import { Overwrite } from 'utility-types';
import { TFsBook, TFsDir, TFsTag, TFsBase } from '../Fs';

interface TDbBookContentBaseV1 {
  hash: string;
  cover?: { buffer: ArrayBuffer; type: string };
}
interface TDbBookContentBaseV2 {
  hash: string;
}

interface TDbBookContentWithArchiveV2 extends TDbBookContentBaseV2 {
  target: { type: string; name: string };
  archive: FilesObject;
}
interface TDbBookContentWithoutArchiveV2 extends TDbBookContentBaseV2 {
  target: { buffer: ArrayBuffer; type: string; name: string };
  archive?: never;
}
interface TDbBookContentWithArchiveV1 extends TDbBookContentBaseV1 {
  target: { type: string; name: string };
  archive: FilesObject;
}
interface TDbBookContentWithoutArchiveV1 extends TDbBookContentBaseV1 {
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

export type TDbBookContentV1 =
  | TDbBookContentWithArchiveV1
  | TDbBookContentWithoutArchiveV1;
export type TDbBookContentV2 =
  | TDbBookContentWithArchiveV2
  | TDbBookContentWithoutArchiveV2;
export type TDbBookContent = TDbBookContentV2;

export type TDbBookCover = {
  hash: string;
  cover?: { buffer: ArrayBuffer; type: string };
};

export type TDbDir = TFsDir;

export type TDbTags = TFsTag & { prev: string | 'none'; next: string | 'none' };

export type TDbBookAndTag = { bookHash: string; tagID: string } & TFsBase;
