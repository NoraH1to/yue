import { IBookInfo } from '@/modules/book/Book';
import { createProcessStore } from './helper';

export type IDownloadProcessBookInfo = Pick<IBookInfo, 'title' | 'type'>;

export const useDownloadStore = createProcessStore<IDownloadProcessBookInfo>(true);
