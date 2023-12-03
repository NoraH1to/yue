import { Button, styled } from '@mui/material';

const StyledMuiIconButton = styled(Button, { label: 'styled-mui-icon-button' })(({ theme }) => ({
  width: '34px',
  height: '34px',
  minWidth: 'unset',
  borderRadius: theme.shape.borderRadius * 2.5,
  color: theme.palette.text.secondary,
}));

export default StyledMuiIconButton;
