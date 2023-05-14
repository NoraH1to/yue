import { Box, ListItemIcon, ListItemText } from '@mui/material';
import RouterLink from '../components/RouterLink';
import { ROUTE_PATH } from '@/router';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import { useTranslation } from 'react-i18next';
import { SettingsRounded } from '@mui/icons-material';

import { BoxProps } from '@mui/material';

const Footer = (props: BoxProps) => {
  const { t } = useTranslation();
  return (
    <Box {...props}>
      {/* 设置 */}
      <RouterLink to={ROUTE_PATH.SETTING}>
        {({ isActive }) => (
          <StyledMuiListItemButton selected={isActive}>
            <ListItemIcon>
              <SettingsRounded />
            </ListItemIcon>
            <ListItemText primary={t('setting')} />
          </StyledMuiListItemButton>
        )}
      </RouterLink>
    </Box>
  );
};

export default Footer;
