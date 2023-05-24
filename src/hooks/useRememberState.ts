import { useLocalStorageState } from 'ahooks';
import { useState } from 'react';

const useRememberState = <T>(
  key: string,
  defaultValue: T,
  defaultRemember = false,
) => {
  const [remember, _setRemember] = useLocalStorageState(`remember-${key}`, {
    defaultValue: defaultRemember,
  });
  const [storageStatus, setStorageStatus] = useLocalStorageState(key, {
    defaultValue,
  });
  const [tmpStatus, setTmpStatus] = useState(defaultValue);

  const setRemember: typeof _setRemember = (newRemember) => {
    if (typeof newRemember === 'function') setRemember(newRemember(remember));
    else if (newRemember === remember) return;
    _setRemember(newRemember);
    if (newRemember) setStorageStatus(tmpStatus);
    else setTmpStatus(storageStatus || defaultValue);
  };

  const status = remember ? storageStatus! : tmpStatus;
  const setStatus = remember ? setStorageStatus : setTmpStatus;

  return [
    { remember, status },
    { setRemember, setStatus },
  ] as const;
};

export default useRememberState;
