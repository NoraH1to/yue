import { delFalsy } from '@/helper';
import fs from '@/modules/fs';
import { getParser } from '@/parsers';
import { useCallback, useEffect, useRef, useState } from 'react';
import useLoading from './useLoading';

import { ABook, IBookInfo } from '@/modules/book/Book';

export const useBook = (options?: { book: IBookInfo }) => {
  const [bookInfo, setBookInfo] = useState<IBookInfo | undefined>(
    options?.book,
  );
  const [book, setBook] = useState<ABook | undefined>();
  const { loading, addLoading } = useLoading();

  useEffect(() => {
    let needCancel = false;
    const parseBook = async () => {
      const parser = getParser(bookInfo?.type || '');
      if (!(parser && bookInfo)) return;
      const realBook = await parser.parse(bookInfo.target, bookInfo);
      if (needCancel) return;
      if (book) await book.destroy();
      setBook(realBook);
    };

    addLoading(parseBook());

    return () => {
      needCancel = true;
    };
  }, [bookInfo]);

  const destroy = useCallback(async () => {
    setBook(undefined);
    setBookInfo(undefined);
  }, []);

  return [
    { book, loading },
    { loadBook: setBookInfo, destroy },
  ] as const;
};
