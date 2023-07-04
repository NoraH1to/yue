import { ABook, IBookInfo } from '@/modules/book/Book';
import { TParse } from '@/modules/parse/Parse';
import { Optional, PromiseType, Required, RequiredKeys } from 'utility-types';

export type Parser<
  B extends new (...args: any) => ABook = new (...args: any) => ABook,
  P extends TParse<B> = TParse<B>,
  I extends PromiseType<ReturnType<P>> = PromiseType<ReturnType<P>>,
> = {
  type: string;
  Book: B;
  parse: P;
  getCacheableInfo: (
    book: InstanceType<B>,
  ) => Optional<Required<Partial<I>, RequiredKeys<IBookInfo>>, 'archive'>;
};

const parserMap = new Map<string, Parser>();

export const registerParser = (plugin: Parser): boolean => {
  const ext = plugin.type;
  if (!ext || parserMap.has(ext)) return false;
  parserMap.set(ext, plugin);
  return true;
};

export const getParser = (ext: string) => {
  if (!parserMap.has(ext)) return null;
  return parserMap.get(ext) || null;
};
