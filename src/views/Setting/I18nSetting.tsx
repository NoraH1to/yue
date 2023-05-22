import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';
import { TranslateRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const langMap: Record<string, string> = {
  zh: '简体中文',
  en: 'English',
};

const I18nSetting = () => {
  const { i18n } = useTranslation();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = !!menuAnchorEl;
  return (
    <>
      <StyledMuiListItemButton
        onClick={(e) => setMenuAnchorEl(e.currentTarget as HTMLDivElement)}>
        <ListItemIcon>
          <TranslateRounded />
        </ListItemIcon>
        <ListItemText
          primary={langMap[i18n.resolvedLanguage]}
          secondary={i18n.resolvedLanguage}
        />
      </StyledMuiListItemButton>
      <Menu
        open={open}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        PaperProps={{
          sx: {
            maxHeight: '134px',
          },
        }}>
        {Object.keys(langMap).map((k) => (
          <MenuItem
            key={k}
            selected={k === i18n.resolvedLanguage}
            onClick={() => {
              i18n.changeLanguage(k);
              setMenuAnchorEl(null);
            }}>
            {langMap[k]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default I18nSetting;
