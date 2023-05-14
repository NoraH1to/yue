import fs from '@/modules/fs';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BookMain from '../BookMain';

const BookListAll = () => {
  const { t } = useTranslation();
  const bookGetter = useCallback(() => fs.getBooks(), []);
  useEffect(() => {
    document.title = t('all book');
  }, []);
  return <BookMain bookGetter={bookGetter} />;
};

export default BookListAll;
