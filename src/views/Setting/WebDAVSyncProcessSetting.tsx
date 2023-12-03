import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import useSetting from '@/hooks/useSetting';
import { SyncRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemSecondaryAction, ListItemText, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WebDAVSyncProcessSetting = () => {
  const { t } = useTranslation();
  const [{ autoSyncProcess }, { setAutoSyncProcess }] = useSetting();
  const handleClickSyncProcessItem = () => setAutoSyncProcess();

  return (
    <StyledMuiListItemButton onClick={handleClickSyncProcessItem}>
      <ListItemIcon>
        <SyncRounded />
      </ListItemIcon>
      <ListItemText
        primary={t('sync book process')}
        secondary={autoSyncProcess ? t('on') : t('off')}
      />
      <ListItemSecondaryAction>
        <Switch tabIndex={-1} checked={autoSyncProcess} />
      </ListItemSecondaryAction>
    </StyledMuiListItemButton>
  );
};

export default WebDAVSyncProcessSetting;
