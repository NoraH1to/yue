import { md5FromBlob } from '@/helper';
import { IBookInfo } from '@/modules/book/Book';

export const getHash = async (
  cacheInfo: { hash?: string; target?: IBookInfo['target'] },
  target: IBookInfo['target'],
) => {
  if (!cacheInfo?.hash && !(cacheInfo?.target instanceof File) && !(target instanceof File))
    throw new Error('Wrong book data');
  const t = cacheInfo?.target instanceof File ? cacheInfo.target : target;
  const hash = cacheInfo?.hash || (await md5FromBlob(t as File));
  return hash;
};
