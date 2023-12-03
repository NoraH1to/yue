import StatusUnExistPage from '@/components/Status/StatusUnExistPage';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import fs from '@/modules/fs';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookMain from '../BookMain';

const BookListTag = () => {
  const { id } = useParams();
  const bookGetter = useCallback(() => fs.getBooksByTagWithoutContent(id!), [id]);
  const { data: tag, status: searchTagStatus } = useStatusLiveQuery(
    () => (id ? fs.getTagById(id) : undefined),
    [id],
    null,
  );
  useEffect(() => {
    document.title = tag?.title || '';
  }, [tag]);

  if (!tag && searchTagStatus === 'resolved') return <StatusUnExistPage />;

  return <BookMain bookGetter={bookGetter} />;
};

export default BookListTag;
