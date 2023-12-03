import { Box, BoxProps } from '@mui/material';
import { FC, PropsWithChildren, forwardRef } from 'react';

export type FixedRatioProps = PropsWithChildren<{
  fixedWidth?: number;
  fixedHeight?: number;
  contentWrapperProps?: BoxProps;
}> &
  BoxProps;

const FixedRatio: FC<FixedRatioProps> = forwardRef(
  ({ fixedWidth = 1, fixedHeight = 1, children, contentWrapperProps, ...props }, ref) => (
    <Box ref={ref} position="relative" {...props}>
      <Box pt={`${(fixedHeight / fixedWidth) * 100}%`}>
        <Box position="absolute" top={0} width={1} height={1} {...contentWrapperProps}>
          {children}
        </Box>
      </Box>
    </Box>
  ),
);

FixedRatio.displayName = 'FixedRatio';

export default FixedRatio;
