import BookGridLayout from '@/components/BookGridLayout';
import { BookItemBaseCardSkeleton } from '@/components/BookItem/BaseCard';
import BookEditTagDialog from '@/components/BookItem/EditTagDialog';
import ToolbarRow from '@/components/Toolbar/ToolbarRow';
import ToolbarRowSpace from '@/components/Toolbar/ToolbarRowSpace';
import VisibleWrapper from '@/components/VisibleWrapper';
import { sortBooksBySorter } from '@/helper';
import useLoading from '@/hooks/useLoading';
import useMinDelayData from '@/hooks/useMinDelayData';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import fs from '@/modules/fs';
import { TFsBook, TFsBookWithTags } from '@/modules/fs/Fs';
import { defaultBookSorter } from '@/modules/fs/constant';
import { ROUTE_PATH } from '@/router';
import { Box, Grow } from '@mui/material';
import { useDebounce } from 'ahooks';
import { useConfirm } from 'material-ui-confirm';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import MainLayout from '../components/MainLayout';
import Search from '../components/Search';
import ToolbarButtonFilter, {
  IFilter,
  ToolbarButtonFilterProps,
} from '../components/ToolbarButtonFilter';
import ToolbarButtonSort from '../components/ToolbarButtonSort';
import ToolbarButtonToggleSidebar from '../components/ToolbarButtonToggleSidebar';
import ToolbarBottom from './ToolbarBottom';
import StatusEmpty from '../components/StatusEmpty';

export type BookMainProps = { bookGetter: () => Promise<TFsBookWithTags[]> };

const BookMain: FC<BookMainProps> = ({ bookGetter }) => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const nav = useNavigate();
  const { addLoading } = useLoading();
  const [sorter, setSorter] = useState(defaultBookSorter);
  const [filter, setFilter] = useState<null | IFilter>(null);
  const { data: originBooks, status } = useStatusLiveQuery(
    bookGetter,
    [bookGetter],
    null,
  );
  const sortedBooks = useMemo(
    () => (originBooks ? sortBooksBySorter(originBooks, sorter) : originBooks),
    [originBooks, sorter],
  );
  // 防止闪烁
  const [searchInput, setSearchInput] = useState('');
  const debounceSearchInput = useDebounce(searchInput, { wait: 250 });
  const { delayData: books, isDelayed } = useMinDelayData(
    sortedBooks,
    [bookGetter],
    100,
    null,
  );
  const loading = !isDelayed || status === 'pending' || books === null;

  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const selectedCount = Object.keys(selectedMap).length;
  const selectMode = !!selectedCount;
  const selectedBookHashList = useMemo(
    () => Object.keys(selectedMap),
    [selectedMap],
  );

  // 为了不触发书本的重渲染
  const selectModeRef = useRef(selectMode);
  selectModeRef.current = selectMode;
  useEffect(() => handleExitSelectedMode(), [bookGetter]);

  // 数据库更新后需要检查选中
  useEffect(() => {
    if (!originBooks || !originBooks[0]) return;
    const map: typeof selectedMap = {};
    originBooks.forEach((book) => {
      selectedMap[book.hash] && (map[book.hash] = true);
    });
    setSelectedMap(map);
  }, [originBooks]);

  const [editTagStatus, setEditTagStatus] = useState<{
    book?: TFsBook;
    open: boolean;
  }>({ open: false });

  const getBookHideStatus = (book: TFsBookWithTags) => {
    return !!(
      (book &&
        debounceSearchInput &&
        !book.title.includes(debounceSearchInput)) ||
      (filter &&
        (filter.hasNotTag
          ? book.tags.length > 0
          : Object.keys(filter.tag).some((tag) => !book.tagsMap[tag])))
    );
  };
  const handleSelectBook = useCallback((book: TFsBook) => {
    setSelectedMap((selectedMap) => {
      if (selectedMap[book.hash]) {
        delete selectedMap[book.hash];
        return { ...selectedMap };
      } else {
        return { ...selectedMap, [book.hash]: true };
      }
    });
  }, []);
  const handleClickBook = useCallback((book: TFsBook) => {
    if (selectModeRef.current) {
      handleSelectBook(book);
    } else {
      nav(`/${ROUTE_PATH.DETAIL}/${book.hash}`);
    }
  }, []);
  const handleCloseEditTagDialog = useCallback(
    () =>
      setEditTagStatus((editTagStatus) => ({
        ...editTagStatus,
        open: false,
      })),
    [],
  );
  const handleOpenEditTagDialog = useCallback(
    (book: TFsBook) => setEditTagStatus({ book, open: true }),
    [],
  );

  const handleExitSelectedMode = useCallback(
    () => setSelectedMap({}),
    [setSelectedMap],
  );
  const handleSelectAll = useCallback(() => {
    if (!books) return;
    const filterBook = books.filter((b) => !getBookHideStatus(b));
    if (selectedCount === filterBook.length) return handleExitSelectedMode();
    const map: typeof selectedMap = {};
    filterBook.forEach((book) => (map[book.hash] = true));
    setSelectedMap(map);
  }, [books, selectedCount, handleExitSelectedMode, getBookHideStatus]);
  const handleBatchDelete = useCallback(() => {
    confirm().then(() => {
      addLoading(
        (async () => {
          await fs.deleteBook(selectedBookHashList);
          handleExitSelectedMode();
        })(),
      );
    });
  }, [confirm, addLoading, selectedBookHashList, handleExitSelectedMode]);

  const handleFilter = useCallback<
    NonNullable<ToolbarButtonFilterProps['onFilter']>
  >(
    (filter, hasFilter) => {
      setFilter(hasFilter ? filter : null);
    },
    [setFilter],
  );

  const ToolbarTop = (
    <ToolbarRow direction="row" gap={2}>
      <ToolbarButtonToggleSidebar />
      <Search
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onClear={() => setSearchInput('')}
      />
      <ToolbarRowSpace />
      <ToolbarButtonFilter onFilter={handleFilter} />
      <ToolbarButtonSort
        onSort={setSorter}
        defaultSorter={defaultBookSorter}
        sortKeys={useMemo(
          () => [
            { key: 'addTs', title: t('bookInfo.addTs') },
            { key: 'lastProcess.ts', title: t('bookInfo.lastProcess.ts') },
            { key: 'title', title: t('bookInfo.title') },
            { key: 'author', title: t('bookInfo.author') },
          ],
          [t],
        )}
      />
    </ToolbarRow>
  );

  const Content = (
    <BookGridLayout component="main" height={1} pb="0 !important">
      {loading
        ? [undefined, undefined, undefined].map((book, i) => (
            <BookItemBaseCardSkeleton key={i} />
          ))
        : books!.map((book, i) => (
            <VisibleWrapper
              key={book?.hash || i}
              hide={book ? getBookHideStatus(book) : false}>
              <BookCard
                book={book}
                selected={!!selectedMap[book?.hash || '']}
                onSelect={handleSelectBook}
                onClick={handleClickBook}
                onEditTag={handleOpenEditTagDialog}
              />
            </VisibleWrapper>
          ))}
    </BookGridLayout>
  );

  const MToolbarBottom = (
    <Grow in={selectMode} unmountOnExit>
      <Box width={1} display="flex" justifyContent="center">
        <ToolbarBottom
          onSelectAll={handleSelectAll}
          onBatchDelete={handleBatchDelete}
          onClose={handleExitSelectedMode}
          selectedCount={selectedCount}
          bookHashList={selectedBookHashList}
        />
      </Box>
    </Grow>
  );

  return (
    <>
      <MainLayout
        ToolbarTop={ToolbarTop}
        ToolbarBottom={MToolbarBottom}
        Content={books ? books.length ? Content : <StatusEmpty /> : Content}
        floatToolbarTop
        floatToolbarBottom
      />
      <BookEditTagDialog
        {...editTagStatus}
        onClose={handleCloseEditTagDialog}
      />
    </>
  );
};

export default BookMain;
