import { fileOpen } from 'browser-fs-access';

import { importBook } from '@/helper';
import useLoading from './useLoading';

const useImportBook = () => {
  const { loading, addLoading } = useLoading();
  const _importBook = async () => {
    let file;
    try {
      file = await fileOpen({ multiple: false });
    } catch {
      /* empty */
    }
    if (!file) return;

    try {
      const res = await addLoading(importBook(file));
      return res;
    } catch (e) {
      return { res: false, msg: (e as Error).message };
    }
  };
  return [
    {
      loading,
    },
    {
      importBook: _importBook,
    },
  ] as const;
};

export default useImportBook;
