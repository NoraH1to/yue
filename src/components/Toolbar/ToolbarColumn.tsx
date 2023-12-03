import { Stack, StackProps } from '@mui/material';
import { forwardRef } from 'react';

export type ToolbarColumnProps = StackProps;

const ToolbarColumn = forwardRef<HTMLDivElement, ToolbarColumnProps>((props, ref) => (
  <Stack ref={ref} flexGrow={1} width={1} direction="column" {...props} />
));

ToolbarColumn.displayName = 'ToolbarColumn';

export default ToolbarColumn;
