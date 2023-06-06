import MuiTextFiled from '@/components/Formik/MuiTextFiled';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import useSetting from '@/hooks/useSetting';
import { EditRounded, FolderRounded } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const WebDAVSyncDirSetting = () => {
  const { t } = useTranslation();
  const [{ sourceDataDir }, { setSourceDataDir }] = useSetting();
  const [openEditSyncDirDialog, setOpenEditSyncDirDialog] = useState(false);
  const handleClickSyncDirItem = () => setOpenEditSyncDirDialog(true);
  const handleCloseEditSyncDirDialog = () => setOpenEditSyncDirDialog(false);
  const handleSubmitSyncDir = (v: { dir: string }) => {
    setSourceDataDir(v.dir);
    handleCloseEditSyncDirDialog();
  };

  return (
    <>
      <StyledMuiListItemButton onClick={handleClickSyncDirItem}>
        <ListItemIcon>
          <FolderRounded />
        </ListItemIcon>
        <ListItemText
          primary={t('source sync dir')}
          secondary={sourceDataDir}
        />
        <ListItemSecondaryAction
          sx={{
            minWidth: '56px',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <IconButton tabIndex={-1} size="large">
            <EditRounded />
          </IconButton>
        </ListItemSecondaryAction>
      </StyledMuiListItemButton>
      <Dialog
        open={openEditSyncDirDialog}
        onClose={handleCloseEditSyncDirDialog}>
        <DialogTitle>{t('source sync dir')}</DialogTitle>
        <Formik
          initialValues={{
            dir: sourceDataDir,
          }}
          validationSchema={Yup.object({
            dir: Yup.string().required(t('formHelper.required') as string),
          })}
          onSubmit={handleSubmitSyncDir}>
          <Form>
            <DialogContent>
              <MuiTextFiled autoFocus name="dir" label={t('source sync dir')} />
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

export default WebDAVSyncDirSetting;
