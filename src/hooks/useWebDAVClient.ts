import { createClient } from '@/modules/fs/webDAV';
import { useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';
import { FileStat, ResponseDataDetailed, WebDAVClient } from 'webdav';
import useMinDelay from './useMinDelay';

const useWebDAVClient = () => {
  const [info, setInfo] = useLocalStorageState<{
    url: string;
    username: string;
    password: string;
  }>('web-dav-info');
  const [client, setClient] = useState<WebDAVClient>();
  const [error, setError] = useState<string>();

  const _setInfo = (i: typeof info) => {
    setInfo(i);
    if (!i) {
      setClient(undefined);
      setError(undefined);
    }
  };

  const { isDelayed } = useMinDelay([info], 250);

  useEffect(() => {
    if (!info) return;
    let cancel = false;
    const _client = createClient(info.url, {
      username: info.username,
      password: info.password,
    });
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
