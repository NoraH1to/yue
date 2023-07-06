import { Stack, StackProps, SxProps } from '@mui/material';
import { FC, forwardRef } from 'react';

export type StatusWrapperProps = StackProps;

const sx: SxProps = { userSelect: 'none' };

const StatusWrapper: FC<StatusWrapperProps> = forwardRef((props, ref) => {
  return (
    <Stack
      width={1}
      height={1}
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      gap={1}
      sx={sx}
      ref={ref}
      {...props}>
      {props.children}
    </Stack>
  );
});

StatusWrapper.displayName = 'StatusWrapper';

export default StatusWrapper;
