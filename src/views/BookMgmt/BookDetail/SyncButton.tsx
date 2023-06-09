import useSetting from '@/hooks/useSetting';
import useSyncProcess from '@/hooks/useSyncProcess';
import { IBookInfoWithoutContent } from '@/modules/book/Book';
import { SyncRounded } from '@mui/icons-material';
import { IconButton, Tooltip, keyframes } from '@mui/material';
import { useUpdateEffect } from 'ahooks';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const rotate = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const SyncButton = ({ book }: { book: IBookInfoWithoutContent }) => {
  const { t } = useTranslation();
  const [{ syncing, error }, { sync }] = useSyncProcess();
  const [{ autoSyncProcess }] = useSetting();
  useEffect(() => {
    if (!autoSyncProcess) return;
    sync(book);
  }, []);

  useUpdateEffect(() => {
    if (!syncing) {
      error
        ? enqueueSnackbar(`${t('actionRes.sync fail')} ${error.message}`, {
            variant: 'warning',
          })
        : enqueueSnackbar(t('actionRes.sync success'), { variant: 'success' });
    }
  }, [syncing, error, t, enqueueSnackbar]);

  return (
    <IconButton disabled={syncing} onClick={() => sync(book)}>
      <Tooltip title={t('action.sync process')}>
        <SyncRounded
          sx={
            syncing
              ? {
                  animation: `${rotate} 1s linear infinite`,
                }
              : undefined
          }
        />
      </Tooltip>
    </IconButton>
  );
};

export default SyncButton;
