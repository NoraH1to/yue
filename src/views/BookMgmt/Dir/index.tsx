import DirGridLayout from '@/components/DirGridLayout';
import { DirItemDirBaseCardSkeleton } from '@/components/DirItem/DirBaseCard';
import ToolbarColumn from '@/components/Toolbar/ToolbarColumn';
import ToolbarRow from '@/components/Toolbar/ToolbarRow';
import ToolbarRowSpace from '@/components/Toolbar/ToolbarRowSpace';
import VisibleWrapper from '@/components/VisibleWrapper';
import { sortDirItemsBySorter } from '@/helper';
import useMinDelayData from '@/hooks/useMinDelayData';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import useWebDAVClient from '@/hooks/useWebDAVClient';
import fs from '@/modules/fs';
import { TFsItemDir, TFsItemFile } from '@/modules/fs/Fs';
import { defaultDirItemSorter } from '@/modules/fs/constant';
import { ROUTE_PATH } from '@/router';
import { Breadcrumbs, Button, styled } from '@mui/material';
import { Box } from '@mui/system';
import { useDebounce } from 'ahooks';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router-dom';
import DirCard from '../components/DirCard';
import FileCard from '../components/FileCard';
import MainLayout from '../components/MainLayout';
import Search from '../components/Search';
import StatusEmpty from '../components/StatusEmpty';
import ToolbarButtonSort from '../components/ToolbarButtonSort';
import ToolbarButtonToggleSidebar from '../components/ToolbarButtonToggleSidebar';
import NeedWebDAVInfo from './NeedWebDAVInfo';
import WebDavError from './WebDAVError';

const RouterBreadcrumbsLinkButton = styled(Button)({
  textTransform: 'none',
  minWidth: 0,
});
const RouterBreadcrumbs: FC<{ pathname: string }> = ({ pathname }) => {
  const { t } = useTranslation();
  const pathList = pathname.split('/');
  return (
    <Breadcrumbs sx={{ flexWrap: 'nowrap', userSelect: 'none' }}>
      {pathList?.map((path, i) => {
        // 最后一个路径如果为空则返回空，针对 `/a/b/` 和 `/` 这种情况
        if (i === pathList.length - 1 && !path) return undefined;
        let fullPath = pathList.slice(0, i + 1).join('/');
        fullPath = `/${ROUTE_PATH.DIR}/${encodeURIComponent(
          pathList.length > 1 ? fullPath : `/${fullPath}`,
        )}`;
        const isCur = i === pathList.length - 1 || pathname === '/';
        return (
          <RouterBreadcrumbsLinkButton
            // @ts-ignore
            component={RouterLink}
            underline="none"
            key={fullPath}
            to={fullPath}
            disabled={isCur}>
            {path === '' ? t('root dir') : path}
          </RouterBreadcrumbsLinkButton>
        );
      })}
    </Breadcrumbs>
  );
};

type DirContentProps = {
  filename: string;
};

const DirContent: FC<DirContentProps> = ({ filename }) => {
  const { t } = useTranslation();
  const [sorter, setSorter] = useState(defaultDirItemSorter);
  const [{ info, client, error, loading: loadingClient }] = useWebDAVClient();

  useEffect(() => {
    document.title = filename || '';
  }, [filename]);

  const { data: originDir, status } = useStatusLiveQuery(
    () => client && fs.getDir(client, filename!, { sorter }),
    [filename, client],
    'loading' as const,
  );

  const { delayData: delayDir } = useMinDelayData(originDir, [filename], 250, 'loading' as const);
  const dir = useMemo(
    () =>
      delayDir === 'loading' || delayDir === undefined
        ? delayDir
        : { ...delayDir, items: sortDirItemsBySorter(delayDir.items, sorter) },
    [delayDir, sorter],
  );

  const loading = dir === 'loading' || status === 'pending' || loadingClient;

  // 防止闪烁
  const [searchInput, setSearchInput] = useState('');
  const debounceSearchInput = useDebounce(searchInput, { wait: 250 });

  const getItemHideStatus = useCallback(
    (item: TFsItemDir | TFsItemFile) =>
      debounceSearchInput ? !item.basename.includes(debounceSearchInput) : false,
    [debounceSearchInput],
  );

  const ToolbarContent = (
    <ToolbarColumn pt={2}>
      <ToolbarRow>
        <ToolbarButtonToggleSidebar />
        <Search
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onClear={() => setSearchInput('')}
        />
        <ToolbarRowSpace />
        <ToolbarButtonSort
          onSort={(newSorter) => setSorter(newSorter)}
          defaultSorter={defaultDirItemSorter}
          sortKeys={[
            { key: 'basename', title: t('dirItemInfo.basename') },
            { key: 'lastmodTs', title: t('dirItemInfo.lastmodTs') },
          ]}
        />
      </ToolbarRow>
      <ToolbarRow sx={{ py: 1 }}>
        <RouterBreadcrumbs pathname={filename!} />
      </ToolbarRow>
    </ToolbarColumn>
  );

  const Content = !info ? (
    <NeedWebDAVInfo />
  ) : error ? (
    <WebDavError title={error.message} />
  ) : loading ? (
    <DirGridLayout>
      {[undefined, undefined, undefined].map((_, i) => (
        <DirItemDirBaseCardSkeleton key={i} />
      ))}
    </DirGridLayout>
  ) : dir ? (
    dir.items.length ? (
      <DirGridLayout>
        {dir.items.map((item) => (
          <VisibleWrapper key={`${item.basename}-${item.id}`} hide={getItemHideStatus(item)}>
            {item.type === 'directory' ? (
              <DirCard dirItem={item} />
            ) : (
              <FileCard client={client!} file={item} sourceId={info.url} />
            )}
          </VisibleWrapper>
        ))}
      </DirGridLayout>
    ) : (
      <StatusEmpty />
    )
  ) : (
    // TODO: 空状态，也是错误状态
    <Box>empty</Box>
  );

  return <MainLayout ToolbarTop={!error && info && ToolbarContent} Content={Content} />;
};

const Dir = () => {
  const { filename } = useParams();
  return <DirContent filename={filename!} />;
};

export default Dir;
