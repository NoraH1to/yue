import { styled } from '@mui/material';
import ToolbarWrapper from '.';

const ToolbarWrapperFloat = styled(ToolbarWrapper)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    padding: theme.spacing(3, 2.5),
  },
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 3.5),
  },
}));

export default ToolbarWrapperFloat;
