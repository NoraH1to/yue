import { IBookInfoWithoutContent } from '@/modules/book/Book';
import fs from '@/modules/fs';
import { useState } from 'react';
import urlJoin from 'url-join';
import useWebDAVClient from './useWebDAVClient';
// @ts-ignore
import ab2str from 'arraybuffer-to-string';
import { useSyncProcessStore } from '@/store/syncProcess';

window.global = window; // fix ab2str's bug

const useSyncProcess = (options: { book?: IBookInfoWithoutContent }) => {
  const { book } = options;
  const { append } = useSyncProcessStore();
  const [{ client, sourceDataDir, error: clientError }] = useWebDAVClient();
  const [isSyncing, setSyncing] = useState(false);
  const [error, setError] = useState<Error>();
  const syncProcessDir = urlJoin(sourceDataDir, 'process');

  const getPathname = () => urlJoin(syncProcessDir, `${book?.hash}.json`);

  const check = async () => {
    if (!client || !book) return;
    const pathname = getPathname();
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

  const updateLocal = async (process: IBookInfoWithoutContent['lastProcess']) => {
    if (!book) return;
    await fs.updateBook({
      hash: book.hash,
      info: {
        lastProcess: process,
      },
    });
  };

  const updateCloud = async (process: IBookInfoWithoutContent['lastProcess']) => {
    if (!client) return;
    const pathname = getPathname();
    await client.putFileContents(pathname, JSON.stringify(process), {
      overwrite: true,
    });
  };

  const sync = async () => {
    if (!book) return;
    setSyncing(true);
    setError(void 0);
    append({
      id: book.hash,
      info: {
        title: book.title,
        type: book.type,
        cover: book.cover,
      },
      run: () =>
        check()
          .then((checkRes) => {
            if (checkRes === 'updateCloud') return updateCloud(book.lastProcess);
            else if (checkRes) return updateLocal(checkRes);
          })
          .catch((e) => setError(e as Error))
          .finally(() => setSyncing(false)),
    });
  };

  return [
    { isSyncing, error: error || clientError },
    { sync, check, updateCloud, updateLocal },
  ] as const;
};

export default useSyncProcess;
