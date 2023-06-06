import { IBookInfo } from '@/modules/book/Book';
import fs from '@/modules/fs';
import { useState } from 'react';
import urlJoin from 'url-join';
import useWebDAVClient from './useWebDAVClient';
// @ts-ignore
import ab2str from 'arraybuffer-to-string';

window.global = window; // fix ab2str's bug

const useSyncProcess = () => {
  const [{ client, loadingPromise, syncProcessDir }] = useWebDAVClient();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error>();

  const getPathname = (book: IBookInfo) =>
    urlJoin(syncProcessDir, `${book.hash}.json`);

  const check = async (book: IBookInfo) => {
    if (!client) return;
    const pathname = getPathname(book);
    await loadingPromise;
    const { lastProcess: process } = book;
    let cloudData;
    try {
      const content = await client.getFileContents(pathname);
      cloudData = JSON.parse(ab2str(content)) as IBookInfo['lastProcess'];
    } catch (e) {
      // ignore
    }
    if (cloudData && cloudData.ts > process.ts) return cloudData;
    else if (!cloudData || (cloudData && cloudData.ts < process.ts))
      return 'updateCloud';
  };

  const updateLocal = async (
    book: IBookInfo,
    process: IBookInfo['lastProcess'],
  ) => {
    await loadingPromise;
    await fs.updateBook({
      hash: book.hash,
      info: {
        lastProcess: process,
      },
    });
  };

  const updateCloud = async (
    book: IBookInfo,
    process: IBookInfo['lastProcess'],
  ) => {
    if (!client) return;
    const pathname = getPathname(book);
    await loadingPromise;
    await client.putFileContents(pathname, JSON.stringify(process), {
      overwrite: true,
    });
  };

  const sync = async (book: IBookInfo) => {
    await loadingPromise;
    setSyncing(true);
    try {
      const checkRes = await check(book);
      if (checkRes === 'updateCloud') updateCloud(book, book.lastProcess);
      else if (checkRes) updateLocal(book, checkRes);
      setError(void 0);
    } catch (e) {
      setError(e as Error);
    } finally {
      setSyncing(false);
    }
  };

  return [
    { syncing, error },
    { sync, check, updateCloud, updateLocal },
  ] as const;
};

export default useSyncProcess;
