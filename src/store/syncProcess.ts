import { IBookInfo } from '@/modules/book/Book';
import { createProcessStore } from './helper';

export type ISyncProcessBookInfo = Pick<IBookInfo, 'title' | 'type' | 'cover'>;

export const useSyncProcessStore = createProcessStore<ISyncProcessBookInfo>({
  immediateStart: true,
});
