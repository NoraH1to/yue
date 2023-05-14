import { DeleteRounded, DownloadRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import ContextMenu, { ContextMenuProps } from '../ContextMenu';
import StyledMuiMenuItem from '../Styled/MuiMenuItem';

export type DirItemFileContextMenuProps = Omit<ContextMenuProps, 'children'> & {
  hasLocal?: boolean;
  onDownload?: () => void;
  onDeleteLocal?: () => void;
};

const DirItemFileContextMenu: FC<DirItemFileContextMenuProps> = ({
  hasLocal,
  onDownload,
  onDeleteLocal,
  ...props
}) => {
  const { t } = useTranslation();
  return (
    <ContextMenu {...props}>
      <StyledMuiMenuItem
        disabled={hasLocal}
        onClick={() => {
          props.onClose?.();
          onDownload?.();
        }}>
        <ListItemIcon>
          <DownloadRounded />
        </ListItemIcon>
        <ListItemText primary={t('dirItemMenu.download to local')} />
      </StyledMuiMenuItem>
      <StyledMuiMenuItem
        disabled={!hasLocal}
        onClick={() => {
          props.onClose?.();
          onDeleteLocal?.();
        }}>
        <ListItemIcon>
          <DeleteRounded />
        </ListItemIcon>
        <ListItemText primary={t('dirItemMenu.delete local')} />
      </StyledMuiMenuItem>
    </ContextMenu>
  );
};

export const MemoDirItemFileContextMenu = memo(DirItemFileContextMenu);

export default DirItemFileContextMenu;
