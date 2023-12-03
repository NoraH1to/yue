import type { ISorter } from '@/modules/fs/Fs';
import useRememberState from './useRememberState';

const useSorter = <T extends object>(
  sorterName: string,
  keyList: Array<keyof T>,
  defaultSorter?: ISorter<T>,
) => {
  defaultSorter = defaultSorter || ({ key: keyList[0], sort: 'desc' } as ISorter<T>);
  const [{ status: curSorter, remember }, { setStatus: setCurSorter, setRemember }] =
    useRememberState(sorterName, defaultSorter, false);

  const toggleSorter = (sort?: ISorter<T>['sort']) => {
    if (sort) return setCurSorter({ ...curSorter, sort });
    if (curSorter.sort === 'asc') setCurSorter({ ...curSorter, sort: 'desc' });
    else setCurSorter({ ...curSorter, sort: 'asc' });
  };

  const setSorterKey = (key: keyof T) => {
    setCurSorter({ ...curSorter, key });
  };

  return [
    { sorter: curSorter, remember },
    { setSorter: setCurSorter, toggleSorter, setSorterKey, setRemember },
  ] as const;
};

export default useSorter;
