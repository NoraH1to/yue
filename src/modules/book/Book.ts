import { Type2Interface } from '@/helper';
import { FilesObject } from 'libarchive.js/src/libarchive';
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

interface IBookInfoBase<P = unknown> {
  hash: string;
  title: string;
  toc: IToc[];
  author?: string;
  cover?: Blob;
  publisher?: string;
  description?: string;
  lastProcess: IProcess<P> & { ts: number };
  type: string;
}
export interface IBookInfoWithArchive<P = unknown> extends IBookInfoBase<P> {
  target: { name: string; type: string };
  archive: FilesObject;
}
export interface IBookInfoWithoutArchive<P = unknown> extends IBookInfoBase<P> {
  target: File;
  archive?: never;
}
export type IBookInfo<P = unknown> =
  | IBookInfoWithoutArchive<P>
  | IBookInfoWithArchive<P>;
export type IBookInfoWithoutContent<P = unknown> = IBookInfoBase<P>;

export type ReaderCompProps = PropsWithRef<{
  colorMode: keyof TAppSetting['readerTheme'];
  readerTheme: TReaderTheme;
  readerSetting: TReaderSetting;
}>;
export abstract class ABook<
  P = unknown,
  I extends TBookConstructorInfo<P> = TBookConstructorInfo<P>,
> implements Type2Interface<IBookInfo<P>>, IController<P>
{
  hash: string;
  readonly target: I['target'];
  readonly archive?: I['archive'];
  title: string;
  author?: string;
  cover?: Blob;
  publisher?: string;
  description?: string;
  // 上次阅读位置
  lastProcess: IBookInfo<P>['lastProcess'];
  toc: IToc[];
  abstract type: string;

  constructor(target: I) {
    this.target = target.target;
    this.title = target.title || target.target.name;
    this.author = target.author;
    this.cover = target.cover;
    this.publisher = target.publisher;
    this.description = target.description;
    this.toc = target.toc || [];
    this.lastProcess = target.lastProcess;
    this.hash = target.hash;
    this.archive = target.archive;
  }

  // controllers
  supportSetting = true;
  abstract ready: Promise<void>;
  abstract nextPage(): Promise<void>;
  abstract prevPage(): Promise<void>;
  abstract jumpTo(page: number | P): Promise<void>;
  abstract getPages(): number;
  abstract getCurrentPage(): number;
  abstract getCurrentSectionPages(): number;
  abstract getCurrentSectionCurrentPage(): number;
  abstract getCurrentProcess(): Promise<IProcess<P> | null>;
  abstract destroy(): Promise<void>;
  abstract ReaderComponent: FC<ReaderCompProps>;
}
