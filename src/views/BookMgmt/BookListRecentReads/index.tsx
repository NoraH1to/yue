import BookDetailAuthor, {
  BookDetailAuthorSkeleton,
} from '@/components/BookDetail/Author';
import BookDetailInfoItem from '@/components/BookDetail/InfoItem';
import BookDetailInfoItemText from '@/components/BookDetail/InfoItemText';
import BookDetailLastReadTime from '@/components/BookDetail/LastReadTime';
import BookDetailProgress from '@/components/BookDetail/Progress';
import BookDetailTitle, {
  BookDetailTitleSkeleton,
} from '@/components/BookDetail/Title';
import { BookItemBaseCardCoverSkeleton } from '@/components/BookItem/BaseCard';
import BookItemCover from '@/components/BookItem/Cover';
import DetailToolbar from '@/components/DetailToolbar';
import FixedRatioBookCover from '@/components/FixedRatioWrapper/FixedRatioBookCover';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import fs from '@/modules/fs';
import { TFsBookWithoutContent } from '@/modules/fs/Fs';
import { gotoReader } from '@/router/routerHelper';
import { Box, Card, Stack } from '@mui/material';
import { StackProps } from '@mui/system';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StatusEmpty from '../components/StatusEmpty';

const coverSizeSx = { width: '33%', maxWidth: '180px' };

const ItemContainer: FC<StackProps> = (props) => (
  <Stack
    p={1.5}
    width={1}
    gap={1}
    direction="row"
    alignItems="flex-start"
    {...props}>
    {props.children}
  </Stack>
);

const ItemInfoContainer: FC<StackProps> = (props) => (
  <Stack flexGrow={1} gap={1} px={1} {...props}>
    {props.children}
  </Stack>
);

const ItemSkeleton = () => (
  <ItemContainer>
    <Box {...coverSizeSx} flexShrink={0}>
      <BookItemBaseCardCoverSkeleton />
    </Box>
    <ItemInfoContainer>
      <BookDetailTitleSkeleton />
      <BookDetailAuthorSkeleton />
    </ItemInfoContainer>
  </ItemContainer>
);

const BookListRecentReads = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { data: books, status } = useStatusLiveQuery(
    () => fs.getRecentReadsBooksWithoutContent(10),
    [],
    null,
  );
  const loading = books === null || status === 'pending';
  useEffect(() => {
    document.title = t('recent reads');
  }, [t]);

  const handleItemClick = (book: TFsBookWithoutContent) => {
    gotoReader(nav, {
      hash: book.hash,
      value:
        typeof book.lastProcess.value === 'string'
          ? book.lastProcess.value
          : JSON.stringify(book.lastProcess.value),
    });
  };
  return (
    <Stack height={1} pt={1}>
      <DetailToolbar onBack={() => nav(-1)} title={t('recent reads')} />
      <Stack overflow="auto" flexGrow={1} height={0} p={2} pt={1} gap={1}>
        {loading ? (
          [undefined, undefined, undefined].map((_, i) => (
            <ItemSkeleton key={i} />
          ))
        ) : books.length > 0 ? (
          books.map((book) => (
            <StyledMuiListItemButton
              key={book.hash}
              sx={{ p: 0, flexGrow: 0 }}
              onClick={() => handleItemClick(book)}>
              <ItemContainer>
                <Card
                  variant="outlined"
                  sx={{
                    ...coverSizeSx,
                    isolation: 'isolate',
                    flexShrink: 0,
                  }}>
                  <FixedRatioBookCover>
                    <BookItemCover
                      height={1}
                      width={1}
                      textCover={book.type}
                      src={book.cover && window.URL.createObjectURL(book.cover)}
                    />
                  </FixedRatioBookCover>
                </Card>
                <ItemInfoContainer>
                  <BookDetailTitle title={book.title} />
                  <BookDetailAuthor author={book.author} />
                  <BookDetailProgress percent={book.lastProcess.percent} />
                  {book.lastProcess.navInfo && (
                    <BookDetailInfoItem>
                      <BookDetailInfoItemText
                        variant="body2"
                        color="text.secondary">
                        {book.lastProcess.navInfo.title}
                      </BookDetailInfoItemText>
                    </BookDetailInfoItem>
                  )}
                  <BookDetailLastReadTime ts={book.lastProcess.ts} />
                </ItemInfoContainer>
              </ItemContainer>
            </StyledMuiListItemButton>
          ))
        ) : (
          <StatusEmpty />
        )}
      </Stack>
    </Stack>
  );
};

export default BookListRecentReads;
