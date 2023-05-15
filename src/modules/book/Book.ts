import { FC, PropsWithRef } from 'react';
import { TAppSetting, TReaderSetting, TReaderTheme } from '../setting';
import { IController } from './Controller';
import { IToc } from './Toc';

export type TBookConstructorInfo<P = unknown> = Omit<IBookInfo<P>, 'type'>;

export type ABookConstructor = new (target: TBookConstructorInfo) => ABook;

export interface IProcess<T = unknown> {
  value?: T;
  percent: number;
  navInfo?: IToc;
}

export interface IBookInfo<P = unknown> {
  hash: string;
  target: File;
  title: string;
  toc: IToc[];
  author?: string;
  cover?: Blob;
  publisher?: string;
  description?: string;
  lastProcess: IProcess<P> & { ts: number };
  type: string;
}

export type ReaderCompProps = PropsWithRef<{
  colorMode: keyof TAppSetting['readerTheme'];
  readerTheme: TReaderTheme;
  readerSetting: TReaderSetting;
}>;

export abstract class ABook<P = unknown, CP = unknown>
  implements IBookInfo<P>, IController<P, CP>
{
  hash: string;
  readonly target: File;
  title: string;
  author?: string;
  cover?: Blob;
  publisher?: string;
  description?: string;
  // 上次阅读位置
  lastProcess: IBookInfo<P>['lastProcess'];
  toc: IToc[];
  abstract type: string;

  constructor(target: TBookConstructorInfo<P>) {
    this.target = target.target;
    this.title = target.title || target.target.name;
    this.author = target.author;
    this.cover = target.cover;
    this.publisher = target.publisher;
    this.description = target.description;
    this.toc = target.toc || [];
    this.lastProcess = target.lastProcess;
    this.hash = target.hash;
  }

  // controllers
  abstract ready: Promise<void>;
  abstract nextPage(): Promise<void>;
  abstract prevPage(): Promise<void>;
  abstract jumpTo(page: number | CP): Promise<void>;
  abstract getPages(): number;
  abstract getCurrentSectionPages(): number;
  abstract getCurrentSectionCurrentPage(): number;
  abstract getCurrentProcess(): Promise<IProcess<P> | null>;
  abstract destroy(): Promise<void>;
  abstract ReaderComponent: FC<ReaderCompProps>;
}
