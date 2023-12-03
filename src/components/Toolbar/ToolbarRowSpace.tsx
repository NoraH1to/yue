import { Box } from '@mui/material';

const ToolbarRowSpace = (props: { enableMargin?: boolean } = { enableMargin: false }) => (
  <Box flexGrow={1} mx={props.enableMargin ? 0 : -1} />
);

export default ToolbarRowSpace;
