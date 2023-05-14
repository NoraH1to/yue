import { useState } from 'react';

import type { ISorter } from '@/modules/fs/Fs';

const useSorter = <T extends object>(
  keyList: Array<keyof T>,
  defaultSorter?: ISorter<T>,
) => {
  defaultSorter =
    defaultSorter || ({ key: keyList[0], sort: 'desc' } as ISorter<T>);
  const [curSorter, setCurSorter] = useState<ISorter<T>>(defaultSorter);

  const toggleSorter = (sort?: ISorter<T>['sort']) => {
    if (sort) return setCurSorter({ ...curSorter, sort });
    if (curSorter.sort === 'asc') setCurSorter({ ...curSorter, sort: 'desc' });
    else setCurSorter({ ...curSorter, sort: 'asc' });
  };

  const setSorterKey = (key: keyof T) => {
    setCurSorter({ ...curSorter, key });
  };

  return [
    { sorter: curSorter },
    { setSorter: setCurSorter, toggleSorter, setSorterKey },
  ] as const;
};

export default useSorter;
