import WebDAV, { YupSchema } from '@/components/Form/WebDAV';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import useWebDAVClient from '@/hooks/useWebDAVClient';
import {
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  StorageRounded,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const WebDAVSetting = () => {
  const { t } = useTranslation();
  const [{ info, error, loading: loadingWebDAV }, { setInfo }] =
    useWebDAVClient();
  const [openEditInfoDialog, setOpenEditInfoDialog] = useState(false);
  const handleClickClientInfoItem = () => setOpenEditInfoDialog(true);
  const handleCloseEditInfoDialog = () => setOpenEditInfoDialog(false);
  const handleSubmitInfo = (i: typeof info) => {
    setInfo(i);
    handleCloseEditInfoDialog();
  };
  const webDAVTitle = useMemo(() => {
    if (loadingWebDAV)
      return <Skeleton variant="rounded" animation="wave" width="50%" />;
    if (!info) return t('unsetting');
    const url = new URL(info?.url);
    return `${url.host}${url.pathname}`;
  }, [info, loadingWebDAV, t]);

  const webDAVSubtitle = useMemo(() => {
    if (loadingWebDAV)
      return (
        <Skeleton
          variant="rounded"
          animation="wave"
          width="30%"
          sx={{ mt: 1 }}
        />
      );
    return error ? error.message : info ? t('connected') : t('unsetting');
  }, [info, error, loadingWebDAV, t]);

  const webDAVIcon = loadingWebDAV ? undefined : error ? (
    <ErrorOutlineRounded color="error" />
  ) : info ? (
    <CheckCircleOutlineRounded color="success" />
  ) : undefined;

  return (
    <>
      <StyledMuiListItemButton
        onClick={handleClickClientInfoItem}
        disabled={loadingWebDAV}>
        <ListItemIcon>
          <StorageRounded />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            sx: { overflow: 'hidden', textOverflow: 'ellipsis' },
          }}
          primary={webDAVTitle}
          secondary={webDAVSubtitle}
        />
        <ListItemIcon sx={{ justifyContent: 'center' }}>
          {webDAVIcon}
        </ListItemIcon>
      </StyledMuiListItemButton>
      <Dialog open={openEditInfoDialog} onClose={handleCloseEditInfoDialog}>
        <DialogTitle>{t('webDAV Configuration')}</DialogTitle>
        <Formik
          initialValues={{
            url: info?.url || '',
            dirBasePath: info?.dirBasePath || '',
            username: info?.username || '',
            password: info?.password || '',
          }}
          validationSchema={Yup.object(YupSchema)}
          // @ts-ignore
          onSubmit={(v: typeof info) => {
            if (!v?.url) handleSubmitInfo(undefined);
            else handleSubmitInfo(v);
          }}>
          <Form>
            <DialogContent>
              <Stack gap={2}>
                <WebDAV />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button type="submit">{t('action.save')}</Button>
            </DialogActions>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
};

export default WebDAVSetting;
