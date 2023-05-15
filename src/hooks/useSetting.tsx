import { emptyFn } from '@/helper';
import { TAppSetting, TSource } from '@/modules/setting';
import { useLocalStorageState } from 'ahooks';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

const defaultSetting: TAppSetting = {
  source: {},
  colorMode: 'system',
  readerTheme: {
    dark: {
      color: 'rgb(183, 183, 183)',
      backgroundColor: 'rgb(66, 66, 66)',
    },
    light: {
      color: '#000000',
    },
  },
};

type SettingContextValue = [
  defaultSetting: TAppSetting,
  actions: {
    setColorMode: (colorMode: TAppSetting['colorMode']) => void;
    setSource: (key: string, source?: TSource) => void;
  },
];

const SettingContext = createContext<SettingContextValue>([
  defaultSetting,
  {
    setColorMode: emptyFn,
    setSource: emptyFn,
  },
]);

export const SettingProvide: FC<PropsWithChildren> = ({ children }) => {
  const [_setting, setSetting] = useLocalStorageState('setting', {
    defaultValue: defaultSetting,
  });
  // 兼容旧版数据结构
  const setting = useMemo(
    () => ({ ..._setting!, source: _setting?.source || {} }),
    [_setting],
  );

  const setColorMode = useCallback(
    (colorMode: TAppSetting['colorMode']) => {
      setSetting((setting) => ({ ...setting!, colorMode: colorMode }));
    },
    [setSetting],
  );

  const setSource = useCallback(
    (key: string, source?: TSource) => {
      if (!source) delete setting!.source[key];
      else setting.source[key] = source;
      setSetting({ ...setting! });
    },
    [setting, setSetting],
  );

  return (
    <SettingContext.Provider value={[setting, { setColorMode, setSource }]}>
      {children}
    </SettingContext.Provider>
  );
};

const useSetting = () => {
  return useContext(SettingContext);
};

export default useSetting;
