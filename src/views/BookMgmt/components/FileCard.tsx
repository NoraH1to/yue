import ContextMenuTrigger, {
  ContextMenuTriggerProps,
} from '@/components/ContextMenu/Trigger';
import { MemoDirItemFileBaseCard } from '@/components/DirItem/FileBaseCard';
import FileContextMenu from '@/components/DirItem/FileContextMenu';
import {
  getBasenameByFilename,
  getExtByFilename,
  getExtByMime,
  getMimeByExt,
  shallowEqual,
} from '@/helper';
import useMgmtBook from '@/hooks/useMgmtBook';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import fs from '@/modules/fs';
import { TFsItemFile } from '@/modules/fs/Fs';
import { ROUTE_PATH } from '@/router';
import { DownloadDoneRounded, FileDownloadRounded } from '@mui/icons-material';
import { Backdrop, CircularProgress, Fade } from '@mui/material';
import { WebDAVClient } from '@norah1to/webdav';
import { FC, memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type FileCardProps = {
  client: WebDAVClient;
  sourceId: string;
  file: TFsItemFile;
};

const FileCard: FC<FileCardProps> = ({ client, file, sourceId }) => {
  const nav = useNavigate();

  const { data: localBook, status } = useStatusLiveQuery(
    async () =>
      fs.getBookBySourceItemInfoWithoutContent({
        sourceId: sourceId,
        etag: file.id,
      }),
    [file.id, sourceId],
    null,
  );

  const [openMenu, setOpenMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [{ loading: importBookIng }, { importBook, deleteBook }] = useMgmtBook({
    scopedLoading: true,
  });

  const loading = status === 'pending' || importBookIng;
  const inProgress = importBookIng;
  const hasLocal = !!localBook;
  const ext = getExtByFilename(file.basename) || getExtByMime(file.mime) || '';
  const cover = useMemo(
    () => localBook?.cover && window.URL.createObjectURL(localBook.cover),
    [localBook?.cover],
  );

  const DownloadIcon = hasLocal ? DownloadDoneRounded : FileDownloadRounded;

  const download = async () => {
    return importBook(
      new Promise<File>((rs, rj) => {
        client
          .getFileContents(file.filename)
          .then((content) =>
            rs(
              new File([content as ArrayBuffer], file.basename, {
                type:
                  getMimeByExt(ext) || file.mime || 'application/octet-stream',
              }),
            ),
          )
          .catch(rj);
      }),
      undefined,
      { sourceId, etag: file.id },
    );
  };

  const handleClick = useCallback(() => {
    if (hasLocal) {
      nav(`/${ROUTE_PATH.DETAIL}/${localBook.hash}`);
    } else {
      download();
    }
  }, [hasLocal]);

  const handleDownload = () => {
    if (!hasLocal) download();
  };

  const handleDeleteLocal = () => {
    localBook && deleteBook(localBook.hash);
  };

  const handleOpenContextmenu = useCallback<
    NonNullable<ContextMenuTriggerProps['onOpen']>
  >(
    (position) => {
      setOpenMenu(true);
      setPosition(position);
    },
    [setOpenMenu, setPosition],
  );

  return (
    <ContextMenuTrigger onOpen={handleOpenContextmenu}>
      {({ triggerProps }) => (
        <MemoDirItemFileBaseCard
          cover={cover}
          ext={ext}
          title={getBasenameByFilename(file.basename)}
          onClick={handleClick}
          {...triggerProps}
          coverChildren={
            <Fade in={!loading}>
              <DownloadIcon
                color={hasLocal ? 'success' : 'action'}
                sx={(theme) => ({
                  position: 'absolute',
                  bottom: theme.spacing(1),
                  right: theme.spacing(1),
                })}
              />
            </Fade>
          }>
          <Backdrop
            open={inProgress}
            sx={{ position: 'absolute' }}
            onContextMenu={(e) => e.preventDefault()}>
            <CircularProgress />
          </Backdrop>
          <FileContextMenu
            hasLocal={hasLocal}
            open={openMenu}
            onClose={() => setOpenMenu(false)}
            x={position.x}
            y={position.y}
            onDownload={handleDownload}
            onDeleteLocal={handleDeleteLocal}
          />
        </MemoDirItemFileBaseCard>
      )}
    </ContextMenuTrigger>
  );
};

export default memo(FileCard, ({ file: pf }, { file: nf }) =>
  shallowEqual(pf, nf),
);
