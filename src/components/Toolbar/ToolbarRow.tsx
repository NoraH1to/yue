import { Stack, StackProps } from '@mui/material';
import { forwardRef } from 'react';

export type ToolbarRowProps = StackProps;

const ToolbarRow = forwardRef<HTMLDivElement, ToolbarRowProps>((props, ref) => (
  <Stack ref={ref} direction="row" gap={2} flexGrow={1} width={1} {...props} />
));

ToolbarRow.displayName = 'ToolbarRow';

export default ToolbarRow;
