import fs from '@/modules/fs';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookMain from '../BookMain';

const BookListTag = () => {
  const { id } = useParams();
  const bookGetter = useCallback(
    () => fs.getBooksByTagWithoutContent(id!),
    [id],
  );
  const tag = useLiveQuery(() => (id ? fs.getTagById(id) : undefined), [id]);
  useEffect(() => {
    document.title = tag?.title || '';
  }, [tag]);
  return <BookMain bookGetter={bookGetter} />;
};

export default BookListTag;
