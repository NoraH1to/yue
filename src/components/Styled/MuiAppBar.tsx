import { AppBar, alpha, styled } from '@mui/material';

const MuiAppBar = styled(AppBar, { label: 'flat-app-bar' })(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(28px)',
  borderRadius: theme.shape.borderRadius * 4,
  position: 'relative',
}));

export default MuiAppBar;
