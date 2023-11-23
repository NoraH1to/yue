import { createLoadingStore, useGlobalLoadingStore } from '@/store/globalLoading';
import { useRef } from 'react';

export const useScopedLoading = () => {
  const useLoadingStoreRef = useRef(createLoadingStore());
  const loadingStore = useLoadingStoreRef.current();
  return loadingStore;
};

export const useLoading = () => {
  const { loading, addLoading, cancelLoading, isSomethingLoading } = useGlobalLoadingStore();
  return [{ loading }, { addLoading, cancelLoading, isSomethingLoading }] as const;
};

export default useLoading;
