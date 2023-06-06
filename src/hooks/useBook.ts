import { delFalsy } from '@/helper';
import { ABook, IBookInfo, IProcess } from '@/modules/book/Book';
import fs from '@/modules/fs';
import { getParser } from '@/parsers';
import { useCallback, useEffect, useState } from 'react';
import useLoading from './useLoading';

export const useBook = (options?: { book: IBookInfo }) => {
  const [bookInfo, setBookInfo] = useState<IBookInfo | undefined>(
    options?.book,
  );
  const [book, setBook] = useState<ABook | undefined>();
  const [currentInfo, setCurrentInfo] = useState<{
    process: IProcess;
    sectionPages: { total: number; current: number };
    totalPages: { total: number; current: number };
  }>({
    process: { percent: 0 },
    sectionPages: { total: 0, current: 0 },
    totalPages: { total: 0, current: 0 },
  });
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

  useEffect(
    () => () => {
      book?.destroy();
    },
    [book],
  );

  const destroy = useCallback(async () => {
    setBook(undefined);
    setBookInfo(undefined);
  }, []);

  const updateProcess = useCallback(
    async (curProcess?: ABook['lastProcess'] | null) => {
      if (!book) return null;
      const process = curProcess || (await book?.getCurrentProcess());
      if (!process) return process;
      const bookProcess = { ts: Date.now(), ...process };
      await fs.updateBook({
        hash: book.hash,
        info: delFalsy({
          lastProcess: bookProcess,
        }),
      });
      return bookProcess;
    },
    [book],
  );

  const updateCurrentInfo = useCallback(
    async (process?: ABook['lastProcess'] | null) => {
      if (!book) return;
      setCurrentInfo((currentInfo) => {
        const newProcess = process || currentInfo.process;
        return {
          ...currentInfo,
          process: newProcess,
          sectionPages: {
            total: book.getCurrentSectionPages(),
            current: book.getCurrentSectionCurrentPage(),
          },
          totalPages: {
            total: book.getPages(),
            current: book.getCurrentPage(),
          },
        };
      });
    },
    [updateProcess, setCurrentInfo, book],
  );

  const nextAndUpdateProcess = useCallback(async () => {
    if (!book) return;
    await book.nextPage();
    await updateCurrentInfo(await updateProcess());
  }, [book, updateCurrentInfo]);
  const prevAndUpdateProcess = useCallback(async () => {
    if (!book) return;
    await book.prevPage();
    await updateCurrentInfo(await updateProcess());
  }, [book, updateCurrentInfo]);
  const jumpToAneUpdateProcess = useCallback(
    async (page: unknown) => {
      if (!book) return;
      await book.jumpTo(page);
      await updateCurrentInfo(await updateProcess());
    },
    [book, updateCurrentInfo],
  );
  return [
    { book, currentInfo, loading },
    {
      loadBook: setBookInfo,
      destroy,
      controller: {
        next: nextAndUpdateProcess,
        prev: prevAndUpdateProcess,
        jumpTo: jumpToAneUpdateProcess,
      },
      updateProcess,
      updateCurrentInfo,
    },
  ] as const;
};
