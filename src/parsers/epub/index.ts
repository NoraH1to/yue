import { EpubBook } from './book';
import parse from './parse';
import { delFalsy } from '@/helper';

import { Parser } from '..';

const parser: Parser<typeof EpubBook> = {
  type: 'epub',
  parse,
  Book: EpubBook,
  getCacheableInfo(book) {
    return delFalsy({
      target: book.target,
      title: book.title,
      author: book.author,
      cover: book.cover,
      publisher: book.publisher,
      description: book.description,
      toc: book.toc,
      cfiList: book.cfiList,
      lastProcess: book.lastProcess,
      hash: book.hash,
      type: book.type,
    });
  },
};

export default parser;
