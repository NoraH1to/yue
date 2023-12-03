import { Box, styled } from '@mui/material';

const ToolbarWrapper = styled(Box, { label: 'app-bar-wrapper' })(({ theme }) => ({
  zIndex: theme.zIndex.appBar,
}));

export default ToolbarWrapper;
