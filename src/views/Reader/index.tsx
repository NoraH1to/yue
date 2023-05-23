import { MemoTocList, TocListProps } from '@/components/BookItem/TocList';
import DetailToolbar from '@/components/DetailToolbar';
import { cancelAble } from '@/helper';
import { useBook } from '@/hooks/useBook';
import useLoading from '@/hooks/useLoading';
import useSetting from '@/hooks/useSetting';
import fs from '@/modules/fs';
import useReaderParams from '@/router/hooks/useReaderParams';
import { Box, Collapse, Stack, alpha, useColorScheme } from '@mui/material';
import * as BSL from 'body-scroll-lock';
import isHotkey from 'is-hotkey';
import {
  KeyboardEventHandler,
  WheelEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  const { loading: globalLoading, addLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const nav = useNavigate();
  const goBack = useCallback(() => nav(-1), [nav]);
  const [
    { book, currentInfo },
    {
      loadBook,
      controller: { jumpTo, next, prev },
    },
  ] = useBook();
  const loading = globalLoading || !book;
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
    const { process } = currentInfo;
    if (!book || !process.navInfo) return;
    document.title = `${book.title} -
    ${process.navInfo.title}`;
  }, [book, currentInfo]);

  // 移动端 safari 添加到主屏幕后会触发过度滚动
  useEffect(() => {
    openActionLayer && BSL.enableBodyScroll(document.body);
    return () => {
      openActionLayer && BSL.disableBodyScroll(document.body);
    };
  }, [openActionLayer]);
  useEffect(() => {
    BSL.disableBodyScroll(document.body);
    return () => {
      BSL.enableBodyScroll(document.body);
    };
  }, []);

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
    fs.getBookByHash(params.hash).then((bookInfo) => {
      if (bookInfo === null) return;
      else if (!bookInfo) throw new Error('load book data fail');
      loadBook(bookInfo);
    });
  }, [params.hash]);

  // 当前进度同步到地址栏
  useEffect(() => {
    const { process } = currentInfo;
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
  }, [nav, currentInfo]);
  useEffect(() => {
    const { process, totalPages } = currentInfo;
    if (!process) return;
    openActionLayer && setCurrentPage(totalPages.current);
  }, [openActionLayer, currentInfo]);

  // 初次加载时根据路由参数跳转到对应位置
  useEffect(() => {
    let cancel = false;
    if (!book || !params) return;
    const load = async () => {
      await book.ready;
      // 只有初次加载才跳转
      if (cancel) return;
      // 根据路由参数跳转到指定位置
      if (params.value) await jumpTo(params.value);
      else if (params.href) await jumpTo(params.href);
      else if (book.lastProcess.value) await jumpTo(book.lastProcess.value);
      else await jumpTo(0);
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
    // 打开的时候更新进度条
    setCurrentPage(currentInfo.totalPages.current);
    setOpenActionLayer(true);
  }, [setOpenActionLayer, currentInfo.process.percent]);
  const handleFullscreen = useCallback((fullscreen: boolean) => {
    fullscreen ? screenfull.request() : screenfull.exit();
  }, []);
  // 导航条
  const ToolbarNav = useMemo(
    () => (
      <ToolbarNavigate
        percent={currentPage}
        maxPercent={currentInfo.totalPages.total}
        onPercent={setCurrentPage}
        onPercentCommit={jumpTo}
        onNext={next}
        onPrev={prev}
      />
    ),
    [
      currentPage,
      setCurrentPage,
      jumpTo,
      next,
      prev,
      currentInfo.totalPages.total,
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
      loaded && jumpTo(toc.href);
    },
    [loaded, jumpTo],
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
              current={currentInfo.process.navInfo}
              currentTitle={t('current location')!}
              onClickToc={handleClickToc}
            />
          </Box>
        </Collapse>
      ),
    [book, showWhichExtendedLayer, currentInfo, handleClickToc, t],
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

  // hotkey
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const isNext = isHotkey(['right', 'down', 'pagedown']);
      const isPrev = isHotkey(['left', 'up', 'pageup']);
      const isToggleActionLayer = isHotkey(['space']);
      if (isNext(e)) next();
      else if (isPrev(e)) prev();
      else if (isToggleActionLayer(e))
        setOpenActionLayer((openActionLayer) => !openActionLayer);
    },
    [openActionLayer, next, prev],
  );
  const handleWheel: WheelEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (openActionLayer) return;
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
    },
    [openActionLayer, next, prev],
  );

  return (
    <Stack
      width={1}
      height={1}
      bgcolor={readerTheme.backgroundColor}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={-1}
      sx={useMemo(() => ({ '&:focus': { outline: 'none' } }), [])}>
      <InfoBarTop
        title={currentInfo.process.navInfo?.title}
        color={infoColor}
      />
      <GestureLayer
        width={1}
        height={0}
        flexGrow={1}
        onOpenAction={handleOpenActionLayer}
        onPageNext={next}
        onPagePrev={prev}>
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
        pages={currentInfo.sectionPages.total}
        currentPage={currentInfo.sectionPages.current}
        color={infoColor}
      />
      <ActionLayer
        open={openActionLayer}
        onClose={handleCloseActionLayer}
        ContentBottom={ActionLayerContentBottom}
        ContentTop={ActionLayerContentTop}
      />
      <LoadingLayer open={loading} />
    </Stack>
  );
};

export default Reader;
