import { ITag } from '@/modules/book/Tag';
import { Chip, Skeleton } from '@mui/material';
import { FC, memo } from 'react';
import BookDetailInfoItem from './InfoItem';

export const BookDetailTagsSkeleton = () => (
  <BookDetailInfoItem>
    <Skeleton animation="wave" height="32px" width="50px" variant="rounded" />
    <Skeleton animation="wave" height="32px" width="70px" variant="rounded" />
    <Skeleton animation="wave" height="32px" width="60px" variant="rounded" />
  </BookDetailInfoItem>
);

export type BookDetailTagsProps = {
  type: string;
  tags?: ITag[];
  onClickTag?: (tag: ITag) => void;
};

const BookDetailTags: FC<BookDetailTagsProps> = ({ type, tags, onClickTag }) => {
  return (
    <BookDetailInfoItem>
      <Chip label={type} sx={{ textTransform: 'uppercase' }} />
      {tags?.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.title}
          sx={{ background: tag.color }}
          onClick={onClickTag && (() => onClickTag(tag))}
        />
      ))}
    </BookDetailInfoItem>
  );
};

export const MemoBookDetailTags = memo(BookDetailTags);

export default BookDetailTags;
