import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material';

const StyledRouterNavLink = styled(NavLink)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecorationLine: 'none',
}));

export default StyledRouterNavLink;
