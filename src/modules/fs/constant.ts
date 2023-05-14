import { TBookSorter, TDirItemSorter } from './Fs';

export const defaultBookSorter: TBookSorter = {
  key: 'addTs',
  sort: 'desc',
};

export const defaultDirItemSorter: TDirItemSorter = {
  key: 'basename',
  sort: 'asc',
};
