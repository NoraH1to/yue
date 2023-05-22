import DetailToolbar from '@/components/DetailToolbar';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import { GitHub, MailRounded, OpenInNewRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const resUrl = 'https://github.com/NoraH1to/yue';
  const authorMail = 'norah1to@qq.com';
  return (
    <Stack height={1} pt={1}>
      <DetailToolbar title={t('about')} onBack={() => nav(-1)} />
      <Box flexGrow={1} height={0} p={[1, 2]}>
        {/* @ts-ignore */}
        <StyledMuiListItemButton href={`mailto:${authorMail}`}>
          <ListItemIcon>
            <Avatar src="/author_avatar.jpg" />
          </ListItemIcon>
          <ListItemText primary={'NoraH1to'} secondary={authorMail} />
          <ListItemSecondaryAction
            sx={{ display: 'flex', alignItems: 'center' }}>
            <MailRounded />
          </ListItemSecondaryAction>
        </StyledMuiListItemButton>
        {/* @ts-ignore */}
        <StyledMuiListItemButton href={resUrl} target="_blank">
          <ListItemIcon>
            <GitHub />
          </ListItemIcon>
          <ListItemText primary={t('repository')} secondary={resUrl} />
          <ListItemSecondaryAction
            sx={{ display: 'flex', alignItems: 'center' }}>
            <OpenInNewRounded />
          </ListItemSecondaryAction>
        </StyledMuiListItemButton>
      </Box>
    </Stack>
  );
};

export default About;
