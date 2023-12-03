import DetailToolbar from '@/components/DetailToolbar';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import useSetting from '@/hooks/useSetting';
import { ROUTE_PATH } from '@/router';
import {
  BrightnessMediumRounded,
  DarkModeRounded,
  InfoRounded,
  LightModeOutlined,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import I18nSetting from './I18nSetting';
import WebDAVInfoSetting from './WebDAVInfoSetting';
import WebDAVSyncDirSetting from './WebDAVSyncDirSetting';
import WebDAVSyncProcessSetting from './WebDAVSyncProcessSetting';

const StyledListSubheader = styled(ListSubheader)({
  background: 'transparent',
  marginLeft: '0.25em',
});

const Setting = () => {
  const [setting, { setColorMode }] = useSetting();
  const { t } = useTranslation();
  const nav = useNavigate();
  const DarkModeIconSx = { mr: 1 };
  return (
    <Stack pt={1} height={1}>
      <DetailToolbar title={t('setting')} />
      <List sx={{ px: 2, flexGrow: 1, height: 0, overflow: 'auto' }}>
        <StyledListSubheader>{t('dark mode')}</StyledListSubheader>
        <ListItem>
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={setting.colorMode}
            onChange={(e, v) => {
              setColorMode(v);
            }}
            sx={{ flexWrap: 'wrap' }}>
            <ToggleButton value="light">
              <LightModeOutlined sx={DarkModeIconSx} />
              {t('darkMode.light')}
            </ToggleButton>
            <ToggleButton value="dark">
              <DarkModeRounded sx={DarkModeIconSx} />
              {t('darkMode.dark')}
            </ToggleButton>
            <ToggleButton value="system">
              <BrightnessMediumRounded sx={DarkModeIconSx} />
              {t('darkMode.system')}
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItem>
        <StyledListSubheader>{t('webDAV')}</StyledListSubheader>
        <WebDAVInfoSetting />
        <WebDAVSyncDirSetting />
        <WebDAVSyncProcessSetting />
        <StyledListSubheader>i18n</StyledListSubheader>
        <I18nSetting />
        <StyledListSubheader>{t('other')}</StyledListSubheader>
        <StyledMuiListItemButton>
          <ListItemIcon>
            <InfoRounded />
          </ListItemIcon>
          <ListItemText primary={t('about')} onClick={() => nav(`/${ROUTE_PATH.ABOUT}`)} />
        </StyledMuiListItemButton>
      </List>
    </Stack>
  );
};

export default Setting;
