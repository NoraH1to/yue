import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';

/**
 * 与 useLiveQuery 使用方式完全一致
 *
 * 区别是额外返回了 `status` 属性判断是否正在加载数据
 *
 * **默认值不能为 `undefined`，
 * 这会导致 `status` 永远为 `"pending"`**
 */
const useStatusLiveQuery = <T, TDefault = undefined>(
  querier: () => Promise<T> | T,
  deps: any[] = [],
  defaultResult: TDefault,
) => {
  const [status, setStatus] = useState<'pending' | 'resolved'>('pending');
  const data = useLiveQuery(querier, deps, defaultResult);
  useEffect(() => {
    setStatus('pending');
  }, deps);
  useEffect(() => {
    if (data === defaultResult) setStatus('pending');
    else setStatus('resolved');
  }, [data]);
  return { data, status };
};

export default useStatusLiveQuery;
