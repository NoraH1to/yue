import EditTagDialogBatch from '@/components/BookItem/EditTagDialogBatch';
import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import Toolbar from '@/components/Toolbar';
import { CloseRounded, DeleteRounded, SelectAllRounded, SellRounded } from '@mui/icons-material';
import { DialogProps, Theme, Tooltip, Typography } from '@mui/material';
import { FC, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type ToolbarBottomProps = {
  onSelectAll?: () => void;
  onBatchDelete?: () => void;
  onClose?: () => void;
  selectedCount: number;
  bookHashList: string[];
};

const ToolbarBottom: FC<ToolbarBottomProps> = ({
  onSelectAll,
  onBatchDelete,
  onClose,
  selectedCount,
  bookHashList,
}) => {
  const { t } = useTranslation();
  const [openBatchEditTagDialog, setOpenBatchEditTagDialog] = useState(false);
  const handleBatchEditTag = useCallback(() => {
    setOpenBatchEditTagDialog(true);
  }, []);
  const handleCloseBatchEditTagDialog = useCallback<NonNullable<DialogProps['onClose']>>(
    (e, r) => {
      setOpenBatchEditTagDialog(false);
      r === 'escapeKeyDown' && onClose?.();
    },
    [onClose],
  );
  return (
    <Toolbar
      toolbarVariant="dense"
      variant="elevation"
      elevation={12}
      sx={useCallback(
        (theme: Theme) => ({
          background: theme.palette.background.paper,
          backdropFilter: 'unset',
          width: 'auto',
          '& .MuiToolbar-root': {
            padding: theme.spacing(1),
          },
          userSelect: 'none',
        }),
        [],
      )}>
      <Typography variant="body1" color="text.primary" mx={1}>
        {t('alreadySelectedCount', { count: selectedCount })}
      </Typography>
      <Tooltip title={t('action.select all')}>
        <StyledMuiIconButton onClick={onSelectAll}>
          <SelectAllRounded />
        </StyledMuiIconButton>
      </Tooltip>
      <Tooltip title={t('tag')}>
        <StyledMuiIconButton onClick={handleBatchEditTag}>
          <SellRounded fontSize="small" />
        </StyledMuiIconButton>
      </Tooltip>
      <Tooltip title={t('action.delete')}>
        <StyledMuiIconButton onClick={onBatchDelete}>
          <DeleteRounded />
        </StyledMuiIconButton>
      </Tooltip>
      <Tooltip title={t('action.close')}>
        <StyledMuiIconButton onClick={onClose}>
          <CloseRounded />
        </StyledMuiIconButton>
      </Tooltip>
      <EditTagDialogBatch
        open={openBatchEditTagDialog}
        onClose={handleCloseBatchEditTagDialog}
        bookHashList={bookHashList}
      />
    </Toolbar>
  );
};

export default memo(ToolbarBottom);
