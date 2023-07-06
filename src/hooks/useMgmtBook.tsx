import { getBasenameByFilename, importBook } from '@/helper';
import fs from '@/modules/fs';
import { ROUTE_PATH } from '@/router';
import { Button } from '@mui/material';
import { fileOpen } from 'browser-fs-access';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useLoading, { useScopedLoading } from './useLoading';

const ButtonGotoBookDetail: FC<{ hash: string }> = ({ hash }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  return (
    <Button onClick={() => nav(`/${ROUTE_PATH.DETAIL}/${hash}`)}>
      {t('action.check')}
    </Button>
  );
};

const useMgmtBook = (options?: {
  scopedLoading?: boolean;
  notice?: boolean;
}) => {
  const { scopedLoading, notice = true } = options || {};
  const { loading: globalLoading, addLoading: addGlobalLoading } = useLoading();
  const [{ loading: localLoading }, { addLoading: addLocalLoading }] =
    useScopedLoading();
  const loading = scopedLoading ? localLoading : globalLoading;
  const addLoading = scopedLoading ? addLocalLoading : addGlobalLoading;
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const { t } = useTranslation();

  const _importBook: typeof importBook = async (...args) => {
    args[0] =
      args[0] instanceof Promise
        ? await addLoading(args[0])
        : args[0] || (await fileOpen({ multiple: false }));
    const bookName = args[0] && `<${getBasenameByFilename(args[0].name)}>`;
    try {
      const res = await addLoading(importBook(...args));
      if (notice && res) {
        enqueueSnackbar({
          variant: res.res ? 'success' : res.msg ? 'warning' : 'error',
          message: `${
            res.res
              ? res.msg || t('actionRes.import book success')
              : res.msg || t('actionRes.import book fail')
          } ${bookName}`,
          action: res.res && <ButtonGotoBookDetail hash={res.info!.hash} />,
        });
      }
      return res;
    } catch (e) {
      const res = { res: false, msg: (e as Error).message } as const;
      notice &&
        enqueueSnackbar({
          variant: 'warning',
          message: `${res.msg}
          ${bookName}`,
        });
      return res;
    }
  };

  const _deleteBook = async (hash: string | string[]) => {
    try {
      await confirm();
    } catch {
      return;
    }
    await addLoading(fs.deleteBook(hash));
    enqueueSnackbar({
      variant: 'success',
      message: t('actionRes.delete book success'),
    });
  };

  return [
    {
      loading,
    },
    {
      importBook: _importBook,
      deleteBook: _deleteBook,
    },
  ] as const;
};

export default useMgmtBook;
