import {
  ChecklistRounded,
  DeleteRounded,
  SellRounded,
} from '@mui/icons-material';
import { Divider, ListItemIcon, ListItemText } from '@mui/material';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ContextMenu, { ContextMenuProps } from '../ContextMenu';
import StyledMuiMenuItem from '../Styled/MuiMenuItem';

export type BookItemContextMenuProps = {
  onMultiSelect?: () => void;
  onEditTag?: () => void;
  onDelete?: () => void;
} & Omit<ContextMenuProps, 'children'>;

const BookItemContextMenu: FC<BookItemContextMenuProps> = ({
  onMultiSelect,
  onEditTag,
  onDelete,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <ContextMenu {...props}>
      <StyledMuiMenuItem
        onClick={() => {
          props.onClose?.();
          onEditTag?.();
        }}>
        <ListItemIcon>
          <SellRounded />
        </ListItemIcon>
        <ListItemText primary={t('tag')} />
      </StyledMuiMenuItem>
      <StyledMuiMenuItem
        onClick={() => {
          props.onClose?.();
          onDelete?.();
        }}>
        <ListItemIcon>
          <DeleteRounded />
        </ListItemIcon>
        <ListItemText primary={t('action.delete')} />
      </StyledMuiMenuItem>
      <Divider />
      <StyledMuiMenuItem
        onClick={() => {
          props.onClose?.();
          onMultiSelect?.();
        }}>
        <ListItemIcon>
          <ChecklistRounded />
        </ListItemIcon>
        <ListItemText primary={t('action.multi select')} />
      </StyledMuiMenuItem>
    </ContextMenu>
  );
};

export const MemoBookItemContextMenu = memo(BookItemContextMenu);

export default BookItemContextMenu;
