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
  const [error, setError] = useState<string>();
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
        await _client.exists('/');
        if (cancel) return;
        setError(undefined);
        setClient(_client);
        if (
          !_info ||
          (_info && !shallowEqual(info, _info)) ||
          _sourceDataDir !== sourceDataDir
        ) {
          await ensureDir(syncRootDir);
          await ensureDir(syncProcessDir);
          _info = { ...info };
          _sourceDataDir = sourceDataDir;
        }
      } catch (e) {
        if (cancel) return;
        // @ts-ignore
        setError(e.statusText || (e as Error).message);
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
