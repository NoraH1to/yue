import { useEffect, useState } from 'react';

const useAppVisible = (options?: { onVisible?: () => void; onHidden?: () => void }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handler = () => {
      document.visibilityState === 'visible' ? options?.onVisible?.() : options?.onHidden?.();
      setVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, [options?.onHidden, options?.onVisible]);
  return [visible];
};

export default useAppVisible;
