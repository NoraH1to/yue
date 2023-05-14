import { FC } from 'react';
import { IProcess, ReaderCompProps } from './Book';

export interface IController<P = unknown, CP = unknown> {
  ready: Promise<void>;
  nextPage(): Promise<void>;
  prevPage(): Promise<void>;
  jumpTo(page: number | CP): Promise<void>;
  getPages(): number;
  getCurrentSectionPages(): number;
  getCurrentSectionCurrentPage(): number;
  getCurrentProcess(): Promise<IProcess<P> | null>;
  destroy(): Promise<void>;
  ReaderComponent: FC<ReaderCompProps>;
}
