import { TAppSetting, TSource } from '@/modules/setting';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { mergeDeepRight } from 'ramda';

type SettingStore = {
  state: TAppSetting;
  setColorMode: (colorMode: TAppSetting['colorMode']) => void;
  addSource: (source: TSource) => void;
  setSource: (name: string, source: Omit<TSource, 'name'>) => void;
  deleteSource: (name: string) => void;
  getSource: (name: string) => TSource | undefined;
  setReaderSetting: (readerSetting: TAppSetting['readerSetting']) => void;
  setAutoSyncProcess: (sync?: boolean) => void;
  setSourceDataDir: (dir: string) => void;
};

const defaultSetting: TAppSetting = {
  source: [],
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
    immer<SettingStore>((set, get) => {
      return {
        state: mergeDeepRight({}, defaultSetting),
        setColorMode: (colorMode) => {
          set((store) => {
            store.state.colorMode = colorMode;
          });
        },
        addSource: (source) => {
          set((store) => {
            store.state.source.push(source);
          });
        },
        setSource: (name, source) => {
          set((store) => {
            const i = store.state.source.findIndex((source) => source.name === name);
            if (i === -1) store.state.source.push({ ...source, name });
            else Object.assign(store.state.source[i], source);
          });
        },
        deleteSource: (name) => {
          set((store) => {
            delete store.state.source[
              store.state.source.findIndex((source) => source.name === name)
            ];
          });
        },
        getSource: (name) => get().state.source.find((source) => source.name === name),
        setReaderSetting: (readerSetting) => {
          set((store) => {
            store.state.readerSetting = readerSetting;
          });
        },
        setAutoSyncProcess: (sync) => {
          set((store) => {
            store.state.autoSyncProcess = sync === undefined ? !store.state.autoSyncProcess : sync;
          });
        },
        setSourceDataDir: (dir) => {
          set((store) => {
            store.state.sourceDataDir = dir;
          });
        },
      };
    }),
    {
      name: 'setting',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
