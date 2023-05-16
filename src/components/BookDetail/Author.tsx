import { PersonRounded } from '@mui/icons-material';
import { Skeleton, Tooltip } from '@mui/material';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import BookDetailInfoItem from './InfoItem';
import BookDetailInfoItemText from './InfoItemText';

export const BookDetailAuthorSkeleton = () => (
  <Skeleton animation="wave" height="24px" width="100px" variant="rounded" />
);

export type BookDetailAuthorProps = { author?: string };

const BookDetailAuthor: FC<BookDetailAuthorProps> = ({ author }) => {
  const { t } = useTranslation();
  return (
    <BookDetailInfoItem>
      <Tooltip title={t('bookInfo.author')}>
        <PersonRounded />
      </Tooltip>
      <BookDetailInfoItemText lineClampCount={1}>
        {author || t('unknown author')}
      </BookDetailInfoItemText>
    </BookDetailInfoItem>
  );
};

export const MemoBookDetailAuthor = memo(BookDetailAuthor);

export default BookDetailAuthor;
