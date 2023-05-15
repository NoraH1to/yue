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
  readerSetting: {
    fontSize: 16,
    lineHeight: 1.4,
    letterGap: 0,
    paragraphGap: 12,
    verticalMargin: 20,
    horizontalMargin: 30,
  },
};

type SettingContextValue = [
  defaultSetting: TAppSetting,
  actions: {
    setColorMode: (colorMode: TAppSetting['colorMode']) => void;
    setSource: (key: string, source?: TSource) => void;
    setReaderSetting: (readerSetting: TAppSetting['readerSetting']) => void;
  },
];

const SettingContext = createContext<SettingContextValue>([
  defaultSetting,
  {
    setColorMode: emptyFn,
    setSource: emptyFn,
    setReaderSetting: emptyFn,
  },
]);

export const SettingProvide: FC<PropsWithChildren> = ({ children }) => {
  const [_setting, setSetting] = useLocalStorageState('setting', {
    defaultValue: defaultSetting,
  });
  // 兼容旧版数据结构
  const setting = useMemo(
    () => ({
      ..._setting!,
      source: _setting?.source || defaultSetting.source,
      readerSetting: _setting?.readerSetting || defaultSetting.readerSetting,
    }),
    [_setting],
  );

  const setColorMode = useCallback<SettingContextValue['1']['setColorMode']>(
    (colorMode) => {
      setSetting((setting) => ({ ...setting!, colorMode: colorMode }));
    },
    [setSetting],
  );

  const setSource = useCallback<SettingContextValue['1']['setSource']>(
    (key, source) => {
      if (!source) delete setting!.source[key];
      else setting.source[key] = source;
      setSetting({ ...setting! });
    },
    [setting, setSetting],
  );

  const setReaderSetting = useCallback<
    SettingContextValue['1']['setReaderSetting']
  >(
    (readerSetting) => {
      setSetting((setting) => ({ ...setting!, readerSetting }));
    },
    [setSetting],
  );

  return (
    <SettingContext.Provider
      value={[setting, { setColorMode, setSource, setReaderSetting }]}>
      {children}
    </SettingContext.Provider>
  );
};

const useSetting = () => {
  return useContext(SettingContext);
};

export default useSetting;
