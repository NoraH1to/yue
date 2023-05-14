import { useEffect, useMemo } from 'react';

const useMutationObserver = (
  target: HTMLElement | null,
  callback: MutationCallback,
) => {
  const ob = useMemo(() => new MutationObserver(callback), [callback]);
  useEffect(() => {
    if (!target) return;
    ob.observe(target);
    return () => {
      ob.disconnect();
    };
  }, [target, ob]);
};

export default useMutationObserver;
