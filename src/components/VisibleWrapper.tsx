import { Box } from '@mui/material';
import { PropsWithChildren, FC } from 'react';

export type VisibleWrapperProps = PropsWithChildren<{ hide: boolean }>;

const VisibleWrapper: FC<VisibleWrapperProps> = ({ hide, children }) => (
  <Box display={hide ? 'none' : undefined} position="relative">
    {children}
  </Box>
);

export default VisibleWrapper;
