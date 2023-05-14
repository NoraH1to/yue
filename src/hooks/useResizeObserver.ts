import { useEffect, useMemo } from 'react';

const useResizeObserver = (
  target: HTMLElement | SVGElement | null,
  callback: ResizeObserverCallback,
) => {
  const ob = useMemo(() => new ResizeObserver(callback), [callback]);
  useEffect(() => {
    if (!target) return;
    ob.observe(target);
    return () => {
      ob.disconnect();
    };
  }, [ob, target]);
};

export default useResizeObserver;
