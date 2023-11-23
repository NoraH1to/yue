import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type IGlobalLoadingStore = {
  loading: boolean;
  addLoading: (job: Promise<unknown>, key?: string | symbol) => () => void;
  cancelLoading: (key: string | symbol) => void;
  isSomethingLoading: (key: string | symbol) => boolean;
};

export const createLoadingStore = () =>
  create(
    immer<IGlobalLoadingStore>((set) => {
      const loadingMap = new Map<string | symbol, Promise<unknown>>();
      const updateLoadingState = () =>
        set((store) => {
          const loading = !loadingMap.keys().next().done;
          store.loading = loading;
        });
      const cancelLoading: IGlobalLoadingStore['cancelLoading'] = (key) => {
        loadingMap.delete(key);
        updateLoadingState();
      };
      const addLoading: IGlobalLoadingStore['addLoading'] = (job, key = Symbol('key')) => {
        let canceled = false;
        const cancel = () => {
          if (canceled) return;
          canceled = true;
          cancelLoading(key);
        };
        job.finally(cancel);
        loadingMap.set(key, job);
        updateLoadingState();
        return cancel;
      };
      const isSomethingLoading: IGlobalLoadingStore['isSomethingLoading'] = loadingMap.has;
      return {
        loading: false,
        addLoading,
        cancelLoading,
        isSomethingLoading,
      };
    }),
  );

export const useGlobalLoadingStore = createLoadingStore();
