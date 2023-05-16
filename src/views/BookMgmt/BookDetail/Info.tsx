import BookDetailAuthor, { BookDetailAuthorSkeleton } from '@/components/BookDetail/Author';
import BookDetailInfoItemText from '@/components/BookDetail/InfoItemText';
import BookDetailLastReadTime from '@/components/BookDetail/LastReadTime';
import BookDetailProgress from '@/components/BookDetail/Progress';
import BookDetailTags, {
  BookDetailTagsSkeleton,
} from '@/components/BookDetail/Tags';
import { ITag } from '@/modules/book/Tag';
import { TFsBook } from '@/modules/fs/Fs';
import { Skeleton, Stack, StackProps } from '@mui/material';
import { FC } from 'react';

export const DetailInfoSkeleton: FC<StackProps> = (props) => (
  <Stack gap={1} alignItems="flex-start" {...props}>
    <BookDetailTagsSkeleton />
    <BookDetailAuthorSkeleton />
    <Skeleton
      animation="wave"
      height="22px"
      width="100%"
      sx={{ maxWidth: '350px' }}
      variant="rounded"
    />
  </Stack>
);

export type DetailInfoProps = {
  tags: ITag[];
  book: TFsBook;
  onClickTag?: (tag: ITag) => void;
} & StackProps;

const DetailInfo: FC<DetailInfoProps> = ({
  tags,
  book: { type, description, author, lastProcess },
  onClickTag,
  ...props
}) => {
  return (
    <Stack gap={1} alignItems="flex-start" {...props}>
      {/* 标签 */}
      <BookDetailTags type={type} tags={tags} onClickTag={onClickTag} />

      {/* 作者 */}
      <BookDetailAuthor author={author} />

      {/* 描述 */}
      {description && (
        <BookDetailInfoItemText color="text.secondary" lineClampCount={3}>
          {description}
        </BookDetailInfoItemText>
      )}

      {/* 进度 */}
      <BookDetailProgress percent={lastProcess.percent || 0} />

      {/* 最后阅读时间 */}
      <BookDetailLastReadTime ts={lastProcess.ts} />
    </Stack>
  );
};

export default DetailInfo;
