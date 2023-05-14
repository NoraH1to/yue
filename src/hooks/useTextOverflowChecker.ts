import { useCallback, useEffect, useState } from 'react';
import useResizeObserver from './useResizeObserver';

const useTextOverflowChecker = (target: HTMLElement | null) => {
  const [isOverflow, setIsOverflow] = useState(false);
  const check = useCallback(() => {
    if (!target) {
      setIsOverflow(false);
      return;
    }
    if (target.clientWidth !== target.scrollWidth) {
      setIsOverflow(target.clientWidth < target.scrollWidth);
    } else {
      setIsOverflow(target.clientHeight < target.scrollHeight);
    }
  }, [target, setIsOverflow]);
  useResizeObserver(target, check);
  useEffect(() => {
    check();
  }, [target]);
  return [isOverflow] as const;
};

export default useTextOverflowChecker;
