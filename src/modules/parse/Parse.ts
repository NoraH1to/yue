import {
  ABook,
  ABookConstructor,
  TBookConstructorInfo,
} from '@/modules/book/Book';

export type TParse<
  B extends new (...args: any) => ABook = ABookConstructor,
  I extends TBookConstructorInfo = ConstructorParameters<B>[0],
> = (
  target: InstanceType<B>['target'],
  cacheInfo?: Partial<I>,
) => Promise<InstanceType<B>>;
