import { Menu, styled } from '@mui/material';

const StyledMuiMenu = styled(Menu, { label: 'styled-mui-menu' })(
  ({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: theme.shape.borderRadius * 3,
      minWidth: 180,
    },
    '& .MuiList-root': {
      padding: theme.spacing(1),
    },
  }),
);

export default StyledMuiMenu;
