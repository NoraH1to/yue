import { Promiser, delFalsy, shallowEqual } from '@/helper';
import { createClient } from '@/modules/fs/webDAV';
import { WebDAVClient } from '@norah1to/webdav';
import { useCallback, useEffect, useMemo, useState } from 'react';
import urlJoin from 'url-join';
import useSetting from './useSetting';

const DEFAULT_SOURCE_KEY = '_default_';

let _info: any;
let _sourceDataDir: any;

const useWebDAVClient = () => {
  const [{ source, sourceDataDir }, { setSource }] = useSetting();
  const [error, setError] = useState<Error>();
  const [testIng, setTestIng] = useState(false);
  const [loadingPromiser, setLoadingPromiser] = useState(new Promiser<void>());
  const info = useMemo(() => {
    return source[DEFAULT_SOURCE_KEY]?.info;
  }, [source[DEFAULT_SOURCE_KEY]]);

  const _createClient = (clientInfo: NonNullable<typeof info>) =>
    createClient(
      clientInfo.url,
      delFalsy({
        username: clientInfo.username || '',
        password: clientInfo.password || '',
        dirBasePath: clientInfo.dirBasePath || '',
      }),
    );

  const [client, setClient] = useState<WebDAVClient | undefined>(
    info && _createClient(info),
  );

  const ensureDir = useCallback(
    async (path: string) => {
      if (!client) return;
      if (!(await client.exists(path))) await client.createDirectory(path);
    },
    [client],
  );

  const _setInfo = (i: typeof info) => {
    if (!i) {
      setSource(DEFAULT_SOURCE_KEY);
      setClient(undefined);
      setError(undefined);
    } else {
      setLoadingPromiser(new Promiser());
      setSource(DEFAULT_SOURCE_KEY, { type: 'webdav', info: i });
    }
  };

  const syncRootDir = sourceDataDir;
  const syncProcessDir = urlJoin(sourceDataDir, 'process');

  useEffect(() => {
    if (!info) return;
    let cancel = false;
    const _client = _createClient(info);
    setTestIng(true);
    (async () => {
      try {
        const awaitStack = [];
        const isEqual =
          _info &&
          shallowEqual(info, _info) &&
          _sourceDataDir === sourceDataDir;
        if (!isEqual) {
          awaitStack.push(_client.exists('/'));
          awaitStack.push(ensureDir(syncRootDir));
          awaitStack.push(ensureDir(syncProcessDir));
          _info = { ...info };
          _sourceDataDir = sourceDataDir;
        }
        await Promise.all(awaitStack);
        if (cancel) return;
        setError(undefined);
        setClient(_client);
      } catch (e) {
        if (cancel) return;
        setError(e as Error);
      } finally {
        setTestIng(false);
        loadingPromiser.resolve();
      }
    })();
    return () => {
      cancel = true;
    };
  }, [info]);

  return [
    {
      client,
      info,
      error,
      loading: testIng,
      loadingPromise: loadingPromiser.promise,
      syncProcessDir,
      syncRootDir,
    },
    { setInfo: _setInfo, ensureDir },
  ] as const;
};

export default useWebDAVClient;
