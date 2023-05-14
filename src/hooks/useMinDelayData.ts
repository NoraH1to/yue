import useMinDelay from './useMinDelay';

const useMinDelayData = <T, TDefault = undefined>(
  data: T,
  deps?: any[],
  delay = 350,
  defaultData?: TDefault,
) => {
  const { isDelayed } = useMinDelay(deps, delay);
  const delayData = isDelayed ? data : defaultData;
  return {
    delayData,
    isDelayed,
  };
};

export default useMinDelayData;
