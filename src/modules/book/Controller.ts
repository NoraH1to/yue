import { FC } from 'react';
import { IProcess, ReaderCompProps } from './Book';

export interface IController<P = unknown> {
  supportSetting: boolean;
  ready: Promise<void>;
  nextPage(): Promise<void>;
  prevPage(): Promise<void>;
  jumpTo(page: number | P): Promise<void>;
  getPages(): number;
  getCurrentPage(): number;
  getCurrentSectionPages(): number;
  getCurrentSectionCurrentPage(): number;
  getCurrentProcess(): Promise<IProcess<P> | null>;
  destroy(): Promise<void>;
  ReaderComponent: FC<ReaderCompProps>;
}
