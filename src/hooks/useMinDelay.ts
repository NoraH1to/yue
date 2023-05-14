import { useEffect, useState } from 'react';

const useMinDelay = (deps?: any[], delay = 350) => {
  const [isDelayed, setIsDelayed] = useState(false);
  useEffect(() => {
    isDelayed && setIsDelayed(false);
    const timer = setTimeout(() => setIsDelayed(true), delay);
    return () => {
      clearTimeout(timer);
      setIsDelayed(false);
    };
  }, deps || []);
  return { isDelayed };
};

export default useMinDelay;
