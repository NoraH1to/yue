import {
  delFalsy,
  getBasenameByFilename,
  getExtByFilename,
  isImageFileName,
} from '@/helper';
import { Archive } from 'libarchive.js';
import { Parser } from '../';
import { getHash } from '../helper';
import { ComicBook } from './book';
import { FilesObject } from 'libarchive.js/src/libarchive';
import { CompressedFile } from 'libarchive.js/src/compressed-file';

const comicExts = ['zip', 'rar', '7z', 'cbz', 'cbr'];

const archiveWorkerUrl = new URL(
  'libarchive.js/dist/worker-bundle.js',
  import.meta.url,
).toString();

Archive.init({
  workerUrl: archiveWorkerUrl,
});

const getNestArchiveContent = async (
  archive: FilesObject,
): Promise<FilesObject> => {
  const keys = Object.keys(archive);
  if (!keys.length) throw new Error('Empty archive');
  if (keys.length > 1) return archive;
  const nestFilename = keys[0];
  const nestContent = archive[nestFilename];
  const isArchive = comicExts.includes(getExtByFilename(nestFilename) || '');
  const isFile = nestContent instanceof File;
  if (!isArchive && isFile) return archive;
  if (isArchive && isFile)
    return getNestArchiveContent(
      await (await Archive.open(nestContent)).extractFiles(),
    );
  if (nestContent instanceof CompressedFile)
    return getNestArchiveContent(
      await (await Archive.open(await nestContent.extract())).extractFiles(),
    );
  return getNestArchiveContent(nestContent as FilesObject);
};

const comicParse: Parser<typeof ComicBook>['parse'] = async (
  target,
  cacheInfo = {},
) => {
  if (!cacheInfo.archive && !(target instanceof File))
    throw new Error('Wrong book data');
  const archive = await getNestArchiveContent(
    cacheInfo.archive ||
      (await (await Archive.open(target as File)).extractFiles()),
  );

  let keys = Object.keys(archive);
  keys.forEach((filename) => {
    if (!(archive[filename] instanceof File) || !isImageFileName(filename))
      delete archive[filename];
  });
  keys = Object.keys(archive);
  if (!keys.length) throw new Error('Parse comic error');
  return new ComicBook({
    ...cacheInfo,
    archive,
    cover: new Blob([await (archive[keys[0]] as File).arrayBuffer()]),
    target,
    title: cacheInfo.title || getBasenameByFilename(target.name),
    hash: await getHash(cacheInfo, target),
    toc: [],
    lastProcess: cacheInfo.lastProcess || { ts: 0, percent: 0 },
  });
};
const getComicCacheableInfo: Parser<typeof ComicBook>['getCacheableInfo'] = (
  book,
) => {
  return delFalsy({
    archive: book.archive,
    cover: book.cover,
    target: book.target,
    type: book.type,
    hash: book.hash,
    title: book.title,
    toc: book.toc,
    lastProcess: book.lastProcess,
  });
};

export const createComicParser = (
  exts: string[],
): Parser<typeof ComicBook>[] => {
  return exts.map((ext) => ({
    type: ext,
    Book: class extends ComicBook {
      type = ext;
      constructor(...args: ConstructorParameters<typeof ComicBook>) {
        super(...args);
      }
    },
    parse: comicParse,
    getCacheableInfo: getComicCacheableInfo,
  }));
};

export default createComicParser(comicExts);
