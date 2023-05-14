import { Promiser } from '@/helper';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import useMinDelay from './useMinDelay';

/**
 * 这玩意是为了配合 `react-router-dom` 中的 `Await` 组件使用的，
 * Suspense 模式还是有许多问题，例如 `deps` 为空数组时，
 * `useEffect` 的清理函数不会被调用，暂时弃用
 */
const useSuspenseLiveQuery = <T>(
  querier: () => Promise<T> | T,
  deps?: any[],
  delay?: number,
): Promise<T> => {
  const originData = useLiveQuery(querier, deps || [], 'loading');
  const [data, setData] = useState(originData);
  const { isDelayed } = useMinDelay(deps || [], delay);
  const [p, setP] = useState(new Promiser<T>());

  useEffect(() => {
    setData(originData);
  }, [originData]);

  useEffect(() => {
    if (data !== 'loading' && isDelayed) {
      p.status === 'pending' && p.resolve(data as T);
    }
  }, [data, isDelayed, p]);

  useEffect(() => {
    setP(new Promiser<T>());
    setData('loading');
  }, deps);

  return p.promise;
};

export default useSuspenseLiveQuery;
