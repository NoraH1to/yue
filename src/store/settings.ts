import { TAppSetting, TSource } from '@/modules/setting';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type SettingStore = {
  state: TAppSetting;
  setColorMode: (colorMode: TAppSetting['colorMode']) => void;
  setSource: (key: string, source?: TSource) => void;
  setReaderSetting: (readerSetting: TAppSetting['readerSetting']) => void;
  setAutoSyncProcess: (sync?: boolean) => void;
  setSourceDataDir: (dir: string) => void;
};

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
  autoSyncProcess: false,
  sourceDataDir: '/yue',
};

export const useSettingStore = create(
  persist(
    immer<SettingStore>((set) => ({
      state: defaultSetting,
      setColorMode: (colorMode) => {
        set((store) => {
          store.state.colorMode = colorMode;
        });
      },
      setSource: (key, source) => {
        set((store) => {
          if (!source) delete store.state.source[key];
          else store.state.source[key] = source;
        });
      },
      setReaderSetting: (readerSetting) => {
        set((store) => {
          store.state.readerSetting = readerSetting;
        });
      },
      setAutoSyncProcess: (sync) => {
        set((store) => {
          store.state.autoSyncProcess =
            sync === undefined ? !store.state.autoSyncProcess : sync;
        });
      },
      setSourceDataDir: (dir) => {
        set((store) => {
          store.state.sourceDataDir = dir;
        });
      },
    })),
    {
      name: 'setting',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
