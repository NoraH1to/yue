import { preventDefault } from '@/helper';
import { Stack, SwipeableDrawer, lighten } from '@mui/material';
import { FC, PropsWithChildren, memo, useCallback, useMemo } from 'react';

export type ActionLayerProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

const prevent = preventDefault();

const ActionLayer: FC<ActionLayerProps> = ({ open, onClose, children }) => {
  return (
    <SwipeableDrawer
      open={open}
      disableSwipeToOpen={true}
      onOpen={useCallback(() => {
        /* 阻止滑动打开 */
      }, [])}
      onClose={onClose}
      onClick={prevent}
      anchor="bottom"
      PaperProps={useMemo(
        () => ({
          sx: (theme) => ({
            position: 'absolute',
            bottom: 0,
            maxWidth: '900px',
            width: 1,
            mx: 'auto',
            borderRadius: theme.shape.borderRadius * 1,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: lighten(theme.palette.background.paper, 0.1),
            overflow: 'hidden',
            padding: theme.spacing(2, 2, 4, 2),
          }),
        }),
        [],
      )}>
      <Stack gap={1}>{children}</Stack>
    </SwipeableDrawer>
  );
};

export default memo(ActionLayer);
