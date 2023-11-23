import { getExtByFilename, getExtByMime, md5FromBlob } from '@/helper';
import i18n from '@/i18n';
import { ABook } from '@/modules/book/Book';
import fs from '@/modules/fs';
import { TFsBookWithoutContent, TSourceItemInfo } from '@/modules/fs/Fs';
import { getParser } from '@/parsers';
import { ROUTE_PATH } from '@/router';
import { IDownloadProcessBookInfo, useDownloadStore } from '@/store/downloadProcess';
import { JOB_STATE } from '@/store/helper';
import { Button } from '@mui/material';
import { fileOpen } from 'browser-fs-access';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';
import * as R from 'ramda';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ButtonGotoBookDetail: FC<{ hash: string }> = ({ hash }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  return <Button onClick={() => nav(`/${ROUTE_PATH.DETAIL}/${hash}`)}>{t('action.check')}</Button>;
};

const useMgmtBook = (options?: { scopedLoading?: boolean; notice?: boolean }) => {
  const { process, append } = useDownloadStore();
  const jobList = Array.from(process.values());
  const jobStateMap = R.groupBy((job) => job.state.toString(), jobList);

  const { notice = true } = options || {};
  const { enqueueSnackbar } = useSnackbar();
  const makeActionNotice = (success: boolean, book?: TFsBookWithoutContent, msg?: string) => {
    enqueueSnackbar({
      variant: success ? 'success' : 'warning',
      message: msg + (book ? `<${book.title}>` : ''),
      action: success && book && <ButtonGotoBookDetail hash={book.hash} />,
    });
  };
  const confirm = useConfirm();
  const { t } = useTranslation();

  const _importBook = async (
    target?: File | Promise<File>,
    cacheInfo?: Partial<ABook>,
    sourceInfo?: TSourceItemInfo,
  ) => {
    target =
      target instanceof Promise ? await target : target || (await fileOpen({ multiple: false }));
    if (!target) return;

    const hash = await md5FromBlob(target);

    const originBook = await fs.getBookByHashWithoutContent(hash);
    if (originBook && !sourceInfo) throw new Error(i18n.t('ebook already exist') as string);

    const type = getExtByMime(target.type) || getExtByFilename(target.name);
    if (!type) throw new Error(i18n.t('unsupported format') as string);

    const parser = getParser(type);
    if (!parser) throw new Error(`${i18n.t('unsupported format')} "${type}"`);

    const book = await new parser.Book(await parser.parse(target, cacheInfo));
    return await fs.addBook({ ...parser.getCacheableInfo(book), type: book.type }, sourceInfo);
  };

  const importBook = async (
    data?: {
      target?: File | Promise<File> | (() => Promise<File>);
      info?: IDownloadProcessBookInfo;
    },
    cacheInfo?: Partial<ABook>,
    sourceInfo?: TSourceItemInfo,
  ) => {
    try {
      const res = append({
        info: {
          title: data?.info?.title || t('unknown'),
          type: data?.info?.type || t('unknown'),
        },
        run: () => {
          const target = data?.target instanceof Function ? data.target() : data?.target;
          return _importBook(target, cacheInfo, sourceInfo);
        },
      });
      const book = await res.jobPromise;
      notice && makeActionNotice(true, book, t('actionRes.import book success') as string);
      return book;
    } catch (e) {
      console.warn('[import book]-fail:', e);
      notice && makeActionNotice(false, undefined, (e as Error).message);
    }
  };

  const deleteBook = async (hash: string | string[]) => {
    try {
      await confirm();
    } catch {
      return;
    }
    await fs.deleteBook(hash);
    makeActionNotice(true, undefined, t('actionRes.delete book success') as string);
  };

  return [
    {
      downloadList: jobList,
      downloadWaitList: jobStateMap[JOB_STATE.WAITING],
      downloadIngList: jobStateMap[JOB_STATE.PENDING],
      downloadedList: jobStateMap[JOB_STATE.SUCCESS],
      downloadFailList: jobStateMap[JOB_STATE.FAIL],
    },
    {
      importBook,
      deleteBook,
    },
  ] as const;
};

export default useMgmtBook;
