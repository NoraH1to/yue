import { IBookInfoWithoutContent } from '@/modules/book/Book';
import fs from '@/modules/fs';
import { useState } from 'react';
import urlJoin from 'url-join';
import useWebDAVClient from './useWebDAVClient';
// @ts-ignore
import ab2str from 'arraybuffer-to-string';

window.global = window; // fix ab2str's bug

const useSyncProcess = () => {
  const [{ client, sourceDataDir, error: clientError }] = useWebDAVClient();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error>();
  const syncProcessDir = urlJoin(sourceDataDir, 'process');

  const getPathname = (book: IBookInfoWithoutContent) =>
    urlJoin(syncProcessDir, `${book.hash}.json`);

  const check = async (book: IBookInfoWithoutContent) => {
    if (!client) return;
    const pathname = getPathname(book);
    const { lastProcess: process } = book;
    let cloudData;
    try {
      const content = await client.getFileContents(pathname);
      cloudData = JSON.parse(ab2str(content)) as IBookInfoWithoutContent['lastProcess'];
    } catch (e) {
      // ignore
    }
    if (cloudData && cloudData.ts > process.ts) return cloudData;
    else if (!cloudData || (cloudData && cloudData.ts < process.ts)) return 'updateCloud';
  };

  const updateLocal = async (
    book: IBookInfoWithoutContent,
    process: IBookInfoWithoutContent['lastProcess'],
  ) => {
    await fs.updateBook({
      hash: book.hash,
      info: {
        lastProcess: process,
      },
    });
  };

  const updateCloud = async (
    book: IBookInfoWithoutContent,
    process: IBookInfoWithoutContent['lastProcess'],
  ) => {
    if (!client) return;
    const pathname = getPathname(book);
    await client.putFileContents(pathname, JSON.stringify(process), {
      overwrite: true,
    });
  };

  const sync = async (book: IBookInfoWithoutContent) => {
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
    { syncing, error: error || clientError },
    { sync, check, updateCloud, updateLocal },
  ] as const;
};

export default useSyncProcess;
