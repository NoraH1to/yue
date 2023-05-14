import { AutoStoriesRounded, RestoreRounded } from '@mui/icons-material';
import { Box, Fab, FabProps } from '@mui/material';
import { t } from 'i18next';
import { FC, forwardRef } from 'react';

export type DetailFabReadProps = { hasRead?: boolean } & Pick<
  FabProps,
  'onClick'
>;

const DetailFabRead: FC<DetailFabReadProps> = forwardRef(
  ({ hasRead, onClick, ...props }, ref) => {
    const Icon = hasRead ? RestoreRounded : AutoStoriesRounded;
    return (
      <Box
        sx={(theme) => ({
          position: 'absolute',
          right: theme.spacing(4),
          bottom: theme.spacing(4),
        })}
        ref={ref}
        {...props}>
        <Fab
          color={hasRead ? 'secondary' : 'primary'}
          variant="extended"
          onClick={onClick}>
          <Icon sx={{ mr: 1 }} />
          {hasRead ? t('action.continue reading') : t('action.start reading')}
        </Fab>
      </Box>
    );
  },
);
DetailFabRead.displayName = 'DetailFabRead';

export default DetailFabRead;
