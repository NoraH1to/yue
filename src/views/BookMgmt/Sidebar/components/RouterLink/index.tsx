import { styled } from '@mui/material';

import StyledRouterLink from '@/components/Styled/RouterNavLink';

const RouterLink = styled(StyledRouterLink)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  display: 'block',
}));

export default RouterLink;
