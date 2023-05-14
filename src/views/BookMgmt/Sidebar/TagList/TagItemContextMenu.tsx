import { DeleteRounded, EditRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import StyledMuiMenuItem from '@/components/Styled/MuiMenuItem';

import ContextMenu, { ContextMenuProps } from '@/components/ContextMenu';
import { FC } from 'react';

const TagItemContextMenu: FC<
  {
    onDelete?: () => void;
    onEdit?: () => void;
  } & Omit<ContextMenuProps, 'children'>
> = ({ onDelete, onEdit, ...props }) => {
  const { t } = useTranslation();
  return createPortal(
    <ContextMenu {...props}>
      <StyledMuiMenuItem onClick={onEdit}>
        <ListItemIcon>
          <EditRounded />
        </ListItemIcon>
        <ListItemText primary={t('action.edit')} />
      </StyledMuiMenuItem>
      <StyledMuiMenuItem onClick={onDelete}>
        <ListItemIcon>
          <DeleteRounded />
        </ListItemIcon>
        <ListItemText primary={t('action.delete')} />
      </StyledMuiMenuItem>
    </ContextMenu>,
    document.body,
  );
};

export default TagItemContextMenu;
