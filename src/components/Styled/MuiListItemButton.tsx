import { ListItemButton, styled } from '@mui/material';

const StyledMuiListItemButton = styled(ListItemButton, {
  label: 'styled-mui-list-item-button',
})(({ theme }) => ({
  marginTop: '1px',
  marginBottom: '1px',
  borderRadius: theme.shape.borderRadius * 2,
}));

export default StyledMuiListItemButton;
