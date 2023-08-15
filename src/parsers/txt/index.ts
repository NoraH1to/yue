import { delFalsy, getBasenameByFilename } from '@/helper';
import { PlainTextViewer } from './TxtParser';
import { Parser } from '..';
import { getHash } from '../helper';
import { TxtBook } from './book';
import workerUrl from './TxtParser/worker?worker&url';

const parser: Parser<typeof TxtBook> = {
  type: 'txt',
  Book: TxtBook,
  parse: async (target, cacheInfo = {}) => {
    return new TxtBook({
      ...cacheInfo,
      // @ts-ignore
      target,
      title: cacheInfo?.title || getBasenameByFilename(target.name),
      hash: await getHash(cacheInfo, target),
      toc: [],
      lastProcess: cacheInfo?.lastProcess || { ts: 0, percent: 0 },
      plainTextViewer: new PlainTextViewer({ workerUrl }),
    });
  },
  getCacheableInfo(book) {
    return delFalsy({
      target: book.target,
      type: book.type,
      hash: book.hash,
      title: book.title,
      toc: book.toc,
      lastProcess: book.lastProcess,
    });
  },
};

export default parser;
