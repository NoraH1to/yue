import { TAppSetting } from '@/modules/setting';
import { useLocalStorageState } from 'ahooks';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from 'react';

const defaultSetting: TAppSetting = {
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
  actions: { setColorMode: (colorMode: TAppSetting['colorMode']) => void },
];

const SettingContext = createContext<SettingContextValue>([
  defaultSetting,
  {
    setColorMode: () => {
      /* empty */
    },
  },
]);

export const SettingProvide: FC<PropsWithChildren> = ({ children }) => {
  const [setting, setSetting] = useLocalStorageState('setting', {
    defaultValue: defaultSetting,
  });

  const setColorMode = useCallback(
    (colorMode: TAppSetting['colorMode']) => {
      setSetting((setting) => ({ ...setting!, colorMode: colorMode }));
    },
    [setSetting],
  );

  return (
    <SettingContext.Provider value={[setting!, { setColorMode }]}>
      {children}
    </SettingContext.Provider>
  );
};

const useSetting = () => {
  return useContext(SettingContext);
};

export default useSetting;
