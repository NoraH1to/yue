import { BookDetailTitleSkeleton } from '@/components/BookDetail/Title';
import { BookItemBaseCardCoverSkeleton } from '@/components/BookItem/BaseCard';
import BookItemCover from '@/components/BookItem/Cover';
import TocList, { TocListProps } from '@/components/BookItem/TocList';
import DetailToolbar from '@/components/DetailToolbar';
import FixedRatioBookCover from '@/components/FixedRatioWrapper/FixedRatioBookCover';
import ToolbarRowSpace from '@/components/Toolbar/ToolbarRowSpace';
import { delFalsy } from '@/helper';
import useMinDelay from '@/hooks/useMinDelay';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import fs from '@/modules/fs';
import { ROUTE_PATH } from '@/router';
import { gotoReader } from '@/router/routerHelper';
import { Box, Card, Fade, Stack, Zoom } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DetailFabRead from './FabRead';
import DetailInfo, { DetailInfoProps, DetailInfoSkeleton } from './Info';
import SyncButton from './SyncButton';

type BookDetailContentProps = {
  hash: string;
};
const BookDetailContent: FC<BookDetailContentProps> = ({ hash }) => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { data: book, status: bookLoadingStatus } = useStatusLiveQuery(
    () => fs.getBookByHash(hash),
    [hash],
    null,
  );
  const { data: tags, status: tagsLoadingStatus } = useStatusLiveQuery(
    () => fs.getTagsByBookHash(hash),
    [hash],
    null,
  );
  if (!book && bookLoadingStatus === 'resolved')
    throw new Error('unexist book');

  const { isDelayed } = useMinDelay([hash], 250);
  const loading =
    bookLoadingStatus === 'pending' ||
    tagsLoadingStatus === 'pending' ||
    !tags ||
    !book ||
    !isDelayed;

  useEffect(() => {
    book?.title && (document.title = book.title);
  }, [book?.title]);

  const cover = useMemo(
    () => book?.cover && URL.createObjectURL(book.cover),
    [book?.cover],
  );

  const handleBack = () => {
    nav(-1);
  };

  const handleClickFabRead = () => {
    if (!book) return;
    gotoReader(
      nav,
      delFalsy({
        hash: book.hash,
      }),
    );
  };

  const handleClickTag: DetailInfoProps['onClickTag'] = (tag) => {
    nav(`/${ROUTE_PATH.TAG}/${tag.id}`);
  };

  const handleClickToc: TocListProps['onClickToc'] = (toc) => {
    if (!book) return;
    gotoReader(nav, {
      hash: book.hash,
      href: toc.href,
    });
  };

  return (
    <Stack height={1} gap={{ xs: 1, md: 2 }} pt={1}>
      <DetailToolbar
        title={loading ? <BookDetailTitleSkeleton /> : book.title}
        onBack={handleBack}
        append={
          book && (
            <>
              <ToolbarRowSpace enableMargin />
              <SyncButton book={book} />
            </>
          )
        }
      />
      <Stack
        direction="row"
        alignItems="flex-start"
        gap={{ xs: 2, md: 3, xl: 4 }}
        px={4}>
        <Card
          variant="outlined"
          sx={{
            transitionProperty: 'box-shadow, max-width',
            flexBasis: '50%',
            maxWidth: {
              xs: '200px',
              lg: '300px',
            },
            flexShrink: 0,
            isolation: 'isolate', // 修复 safari 上子元素溢出边框的问题
          }}>
          <FixedRatioBookCover width={1}>
            {loading ? (
              <Fade in>
                <BookItemBaseCardCoverSkeleton />
              </Fade>
            ) : (
              <BookItemCover
                width={1}
                height={1}
                src={cover}
                textCover={book.type}
              />
            )}
          </FixedRatioBookCover>
        </Card>
        {loading ? (
          <DetailInfoSkeleton flexGrow={1} />
        ) : (
          <DetailInfo
            flexGrow={1}
            tags={tags}
            book={book}
            onClickTag={handleClickTag}
          />
        )}
      </Stack>
      <Box flexGrow={1} height={0} px={3} pb={2} overflow="auto">
        {!loading && (
          <TocList
            tocList={book.toc}
            current={book.lastProcess.navInfo}
            currentTitle={t('last read')!}
            onClickToc={handleClickToc}
          />
        )}
      </Box>
      <Zoom in={!loading} unmountOnExit>
        <DetailFabRead
          hasRead={!!book?.lastProcess?.ts}
          onClick={handleClickFabRead}
        />
      </Zoom>
    </Stack>
  );
};

const BookDetail = () => {
  const { hash } = useParams();
  return <BookDetailContent hash={hash!} />;
};

export default BookDetail;
