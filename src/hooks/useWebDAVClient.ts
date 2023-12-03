import { delFalsy } from '@/helper';
import { createClient } from '@/modules/fs/webDAV';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WebDAVClient } from 'webdav';
import useSetting from './useSetting';

const DEFAULT_SOURCE_KEY = 'DEFAULT';

export interface IUseWebDAVClientOptions {
  autoTest?: boolean;
}

const useWebDAVClient = (options?: IUseWebDAVClientOptions) => {
  const [{ sourceDataDir }, { setSource, deleteSource, getSource }] = useSetting();
  const [error, setError] = useState<Error>();
  const [testing, setTesting] = useState(!!options?.autoTest);
  const info = getSource(DEFAULT_SOURCE_KEY)?.info;

  const ensureDir = useCallback(
    async (path: string, client: WebDAVClient, signal?: AbortSignal) => {
      if (!(await client.exists(path))) await client.createDirectory(path, { signal });
    },
    [],
  );

  const createClientByInfo = (clientInfo: {
    url: string;
    username?: string;
    password?: string;
    dirBasePath?: string;
  }) => {
    let hasEnsureRootDir = false;
    const skipFn = [
      'createReadStream',
      'createWriteStream',
      'getFileDownloadLink',
      'getFileUploadLink',
      'getHeaders',
      'setHeaders',
    ] as unknown as keyof WebDAVClient;
    const client = createClient(
      clientInfo.url,
      delFalsy({
        username: clientInfo.username || '',
        password: clientInfo.password || '',
        dirBasePath: clientInfo.dirBasePath || '',
      }),
    );
    return new Proxy(client, {
      get: function (target, key, receiver) {
        const targetValue = Reflect.get(target, key, receiver);
        if (typeof targetValue !== 'function' || skipFn.includes(key.toString()))
          return targetValue;
        return (...args: unknown[]) => {
          if (hasEnsureRootDir)
            return (targetValue as (...args: unknown[]) => unknown).apply(this, args);
          return ensureDir(sourceDataDir, client).then(() => {
            hasEnsureRootDir = true;
            return (targetValue as (...args: unknown[]) => unknown).apply(this, args);
          });
        };
      },
    });
  };

  const client = useRef<WebDAVClient | undefined>(info && createClientByInfo(info));

  const _setInfo = (i?: typeof info) => {
    setError(undefined);
    if (!i) {
      deleteSource(DEFAULT_SOURCE_KEY);
      client.current = undefined;
    } else {
      setSource(DEFAULT_SOURCE_KEY, { type: 'webdav', info: i });
      client.current = createClientByInfo(i);
    }
  };

  useEffect(() => {
    if (!testing || !client.current) return;
    const abortCtl = new AbortController();
    const awaitStack = [];
    awaitStack.push(ensureDir(sourceDataDir, client.current, abortCtl.signal));
    (async () => {
      try {
        await Promise.all(awaitStack);
        setError(undefined);
      } catch (e) {
        setError(e as Error);
      } finally {
        setTesting(false);
        abortCtl.abort();
      }
    })();
    return () => abortCtl.abort();
  }, [sourceDataDir, testing]);

  return [
    {
      client: client.current,
      info,
      error,
      testing,
      sourceDataDir,
    },
    { setInfo: _setInfo, test: () => setTesting(true), ensureDir },
  ] as const;
};

export default useWebDAVClient;
