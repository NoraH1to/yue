import { MenuItem, styled } from '@mui/material';

const StyledMuiMenuItem = styled(MenuItem, { label: 'styled-mui-menu-item' })(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  margin: '1px 0',
}));

export default StyledMuiMenuItem;
