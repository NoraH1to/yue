import { delFalsy } from '@/helper';
import { createClient } from '@/modules/fs/webDAV';
import { useEffect, useMemo, useState } from 'react';
import { FileStat, ResponseDataDetailed, WebDAVClient } from '@norah1to/webdav';
import useMinDelay from './useMinDelay';
import useSetting from './useSetting';

const DEFAULT_SOURCE_KEY = '_default_';

const useWebDAVClient = () => {
  const [{ source }, { setSource }] = useSetting();
  const [client, setClient] = useState<WebDAVClient>();
  const [error, setError] = useState<string>();
  const info = useMemo(() => {
    return source[DEFAULT_SOURCE_KEY]?.info;
  }, [source[DEFAULT_SOURCE_KEY]]);

  const _setInfo = (i: typeof info) => {
    if (!i) {
      setSource(DEFAULT_SOURCE_KEY);
      setClient(undefined);
      setError(undefined);
    } else {
      setSource(DEFAULT_SOURCE_KEY, { type: 'webdav', info: i });
    }
  };

  const { isDelayed } = useMinDelay([info], 250);

  useEffect(() => {
    if (!info) return;
    let cancel = false;
    const _client = createClient(
      info.url,
      delFalsy({
        username: info.username || '',
        password: info.password || '',
        dirBasePath: info.dirBasePath || '',
      }),
    );
    _client
      .getDirectoryContents('/', { deep: false, details: true })
      .then((res) => {
        if (cancel) return;
        const detail = res as ResponseDataDetailed<Array<FileStat>>;
        if (detail.status < 200 || detail.status >= 400)
          setError(detail.statusText);
        else {
          setError(undefined);
          setClient(_client);
        }
      })
      .catch((e) => {
        setError(e.statusText || (e as Error).message);
      });
    return () => {
      cancel = true;
    };
  }, [info]);

  return [
    {
      client,
      info,
      error,
      loading: isDelayed ? (info ? !client && !error : false) : true,
    },
    { setInfo: _setInfo },
  ] as const;
};

export default useWebDAVClient;
