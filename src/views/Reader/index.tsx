import { MemoTocList, TocListProps } from '@/components/BookItem/TocList';
import DetailToolbar from '@/components/DetailToolbar';
import { cancelAble, delFalsy } from '@/helper';
import { useBook } from '@/hooks/useBook';
import useLoading from '@/hooks/useLoading';
import useSetting from '@/hooks/useSetting';
import { IToc } from '@/modules/book/Toc';
import fs from '@/modules/fs';
import { TFsBook } from '@/modules/fs/Fs';
import useReaderParams from '@/router/hooks/useReaderParams';
import { Box, Collapse, Stack, alpha, useColorScheme } from '@mui/material';
import * as BSL from 'body-scroll-lock';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import screenfull from 'screenfull';
import ActionLayer from './components/ActionLayer';
import ToolbarAction from './components/ActionLayer/ToolbarAction';
import ToolbarNavigate from './components/ActionLayer/ToolbarNavigate';
import GestureLayer from './components/GestureLayer';
import InfoBarBottom from './components/InfoBarBottom';
import InfoBarTop from './components/InfoBarTop';
import LoadingLayer from './components/LoadingLayer';
import ReaderSetting from './components/ReaderSetting';

// TODO: 拆分代码
// TODO: 键盘快捷键、鼠标滚轮

const Reader = () => {
  // 各种初始状态
  const [params] = useReaderParams();
  const [bookInfo, setBookInfo] = useState<undefined | null | TFsBook>(null);
  const { loading: globalLoading, addLoading } = useLoading();
  const loadingBookInfo = bookInfo === null;
  const loading = globalLoading || loadingBookInfo;
  const [loaded, setLoaded] = useState(false);
  const nav = useNavigate();
  const goBack = useCallback(() => nav(-1), [nav]);
  const [{ book }, { loadBook }] = useBook();
  const [currentNav, setCurrentNav] = useState<IToc>();
  const [currentPageInfo, setCurrentPageInfo] = useState<{
    total?: number;
    current?: number;
  }>({});
  const [currentPercent, setCurrentPercent] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const BookComponent = useMemo(
    () => (book ? memo(book.ReaderComponent) : undefined),
    [book],
  );
  const [openActionLayer, setOpenActionLayer] = useState(false);
  const [showWhichExtendedLayer, setShowWhichExtendedLayer] = useState<
    'toc' | 'readerSetting' | undefined | false
  >();
  const { t } = useTranslation();

  useEffect(() => {
    if (!book || !currentNav) return;
    document.title = `${book.title} -
    ${currentNav.title}`;
  }, [book, currentNav]);

  // 移动端 safari 添加到主屏幕后会触发过度滚动
  useEffect(() => {
    BSL.disableBodyScroll(document.body);
    return () => {
      BSL.enableBodyScroll(document.body);
    };
  }, []);
  useEffect(() => {
    openActionLayer && BSL.enableBodyScroll(document.body);
    return () => {
      openActionLayer && BSL.disableBodyScroll(document.body);
    };
  }, [openActionLayer]);

  // 系统配置、主题相关
  const [setting, { setColorMode }] = useSetting();
  const { systemMode } = useColorScheme();
  const realMode = useMemo(
    () =>
      setting.colorMode === 'system'
        ? systemMode || 'light'
        : setting.colorMode,
    [setting, systemMode],
  );
  const readerTheme = useMemo(
    () => setting.readerTheme[realMode],
    [setting, realMode],
  );
  const readerSetting = useMemo(() => setting.readerSetting, [setting]);
  const infoColor = useMemo(
    () => readerTheme.color && alpha(readerTheme.color, 0.8),
    [readerTheme],
  );

  // 加载图书数据
  useEffect(() => {
    fs.getBookByHash(params.hash).then(setBookInfo);
  }, [params.hash]);
  useEffect(() => {
    if (bookInfo === null) return;
    else if (!bookInfo) throw new Error('load book data fail');
    loadBook(bookInfo);
  }, [bookInfo]);

  // 更新书本阅读进度并同步到地址栏
  const updateProcess = useCallback(async () => {
    if (!book) return null;
    const process = await book?.getCurrentProcess();
    if (!process) return process;
    process &&
      (await fs.updateBook({
        hash: book.hash,
        info: delFalsy({
          lastProcess: { ...process, ts: Date.now() },
        }),
      }));
    const prev = new URL(window.location.href).searchParams;
    process?.value &&
      prev.set(
        'value',
        typeof process.value === 'string'
          ? process.value
          : JSON.stringify(process.value),
      );
    let searchStr = '';
    prev.forEach((v, k) => (searchStr += `&${k}=${v}`));
    nav(`${window.location.pathname}?${searchStr}`, { replace: true });
    return process;
  }, [nav, book]);

  // 代理翻页跳转操作，更新进度和当前章节信息
  const updateCurrentInfo = useCallback(async () => {
    if (!book) return;
    const res = await updateProcess();
    if (res) {
      const { navInfo, percent } = res;
      setCurrentPercent(percent);
      openActionLayer && setCurrentPage(percent * book.getPages());
      if (
        navInfo &&
        (!currentNav ||
          currentNav.href !== navInfo.href ||
          currentNav.title !== navInfo.title)
      )
        setCurrentNav(navInfo);
    }

    setCurrentPageInfo({
      total: book?.getCurrentSectionPages(),
      current: book?.getCurrentSectionCurrentPage(),
    });
  }, [
    updateProcess,
    currentNav,
    setCurrentNav,
    setCurrentPageInfo,
    book,
    setCurrentPage,
    openActionLayer,
  ]);
  const nextAndUpdateProcess = useCallback(async () => {
    if (!book) return;
    await book.nextPage();
    await updateCurrentInfo();
  }, [book, updateCurrentInfo]);
  const prevAndUpdateProcess = useCallback(async () => {
    if (!book) return;
    await book.prevPage();
    await updateCurrentInfo();
  }, [book, updateCurrentInfo]);
  const jumpToAneUpdateProcess = useCallback(
    async (page: unknown) => {
      if (!book) return;
      await book.jumpTo(page);
      await updateCurrentInfo();
    },
    [book, updateCurrentInfo],
  );

  // 初次加载时根据路由参数跳转到对应位置
  useEffect(() => {
    let cancel = false;
    if (!book || !params) return;
    const load = async () => {
      await book.ready;
      // 只有初次加载才跳转
      if (cancel) return;
      // 根据路由参数跳转到指定位置
      if (params.value) await jumpToAneUpdateProcess(params.value);
      else if (params.href) await jumpToAneUpdateProcess(params.href);
      else if (book.lastProcess.value)
        await jumpToAneUpdateProcess(book.lastProcess.value);
      else await jumpToAneUpdateProcess(0);
      if (cancel) return;
      setLoaded(true);
    };
    if (loaded) return;
    const [loadPromise, cancelLoad] = cancelAble(load());
    addLoading(loadPromise);
    return () => {
      cancel = true;
      cancelLoad();
    };
  }, [book, params, loaded]);

  // 操作层
  const handleCloseActionLayer = useCallback(() => {
    setOpenActionLayer(false);
    setShowWhichExtendedLayer(false);
  }, [setOpenActionLayer, setShowWhichExtendedLayer]);
  const handleOpenActionLayer = useCallback(async () => {
    if (!book) return;
    // 打开的时候更新进度条
    setCurrentPage(currentPercent * book.getPages());
    setOpenActionLayer(true);
  }, [setOpenActionLayer, book, currentPercent]);
  const handleFullscreen = useCallback((fullscreen: boolean) => {
    fullscreen ? screenfull.request() : screenfull.exit();
  }, []);
  // 导航条
  const ToolbarNav = useMemo(
    () =>
      book && (
        <ToolbarNavigate
          percent={currentPage}
          maxPercent={book.getPages()}
          onPercent={setCurrentPage}
          onPercentCommit={jumpToAneUpdateProcess}
          onNext={nextAndUpdateProcess}
          onPrev={prevAndUpdateProcess}
        />
      ),
    [
      book,
      currentPage,
      setCurrentPage,
      jumpToAneUpdateProcess,
      nextAndUpdateProcess,
      prevAndUpdateProcess,
    ],
  );
  // 操作
  const handleShowToc = useCallback(
    () =>
      setShowWhichExtendedLayer((showWhichExtendedLayer) =>
        showWhichExtendedLayer === 'toc' ? false : 'toc',
      ),
    [setShowWhichExtendedLayer],
  );
  const handleShowReaderSetting = useCallback(
    () =>
      setShowWhichExtendedLayer((showWhichExtendedLayer) =>
        showWhichExtendedLayer === 'readerSetting' ? false : 'readerSetting',
      ),
    [setShowWhichExtendedLayer],
  );
  const ToolbarAct = useMemo(
    () =>
      book && (
        <ToolbarAction
          onToggleColorMode={setColorMode}
          onOpenNav={handleShowToc}
          onToggleFullscreen={handleFullscreen}
          onOpenSetting={handleShowReaderSetting}
          hideSetting={!book.supportSetting}
        />
      ),
    [book, setColorMode, handleShowToc],
  );
  // 目录
  const handleClickToc = useCallback<NonNullable<TocListProps['onClickToc']>>(
    (toc) => {
      book && loaded && jumpToAneUpdateProcess(toc.href);
    },
    [book, loaded, jumpToAneUpdateProcess],
  );
  const ToolbarTocList = useMemo(
    () =>
      book && (
        <Collapse
          in={showWhichExtendedLayer === 'toc'}
          sx={{ maxHeight: '50vh', overflow: 'auto' }}>
          <Box>
            <MemoTocList
              tocList={book.toc}
              current={currentNav}
              currentTitle={t('current location')!}
              onClickToc={handleClickToc}
            />
          </Box>
        </Collapse>
      ),
    [book, showWhichExtendedLayer, currentNav, handleClickToc, t],
  );
  // 阅读器字体设置等
  const ToolbarReaderSetting = useMemo(
    () =>
      book &&
      book.supportSetting && (
        <Collapse in={showWhichExtendedLayer === 'readerSetting'}>
          <ReaderSetting />
        </Collapse>
      ),
    [book, showWhichExtendedLayer],
  );
  const ActionLayerContentBottom = useMemo(
    () => (
      <>
        {ToolbarNav}
        {ToolbarTocList}
        {ToolbarReaderSetting}
        {ToolbarAct}
      </>
    ),
    [ToolbarNav, ToolbarTocList, ToolbarReaderSetting, ToolbarAct],
  );
  const ActionLayerContentTop = useMemo(
    () => (
      <DetailToolbar
        sx={(theme) => ({
          ml: -2,
          width: `calc(100% + ${theme.spacing(4)})`,
        })}
        onBack={goBack}
        title={book?.title}
      />
    ),
    [book, goBack],
  );

  return (
    <Stack width={1} height={1} bgcolor={readerTheme.backgroundColor}>
      <InfoBarTop title={currentNav?.title} color={infoColor} />
      <GestureLayer
        width={1}
        height={0}
        flexGrow={1}
        onOpenAction={handleOpenActionLayer}
        onPageNext={nextAndUpdateProcess}
        onPagePrev={prevAndUpdateProcess}>
        <Box
          sx={useMemo(
            () => ({
              width: 1,
              height: 1,
              opacity: loaded ? 1 : 0,
              transition: 'opacity 250ms',
              pointerEvents: 'none',
            }),
            [loaded],
          )}>
          {useMemo(
            () =>
              BookComponent && (
                <BookComponent
                  colorMode={realMode}
                  readerTheme={readerTheme}
                  readerSetting={readerSetting}
                />
              ),
            [BookComponent, realMode, readerTheme, readerSetting],
          )}
        </Box>
      </GestureLayer>
      <InfoBarBottom
        pages={currentPageInfo.total}
        currentPage={currentPageInfo.current}
        color={infoColor}
      />
      {useMemo(
        () =>
          book && (
            <ActionLayer
              open={openActionLayer}
              onClose={handleCloseActionLayer}
              ContentBottom={ActionLayerContentBottom}
              ContentTop={ActionLayerContentTop}
            />
          ),
        [
          book,
          openActionLayer,
          handleCloseActionLayer,
          ActionLayerContentBottom,
          ActionLayerContentTop,
        ],
      )}
      <LoadingLayer open={loading} />
    </Stack>
  );
};

export default Reader;
