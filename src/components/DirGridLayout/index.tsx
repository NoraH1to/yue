import { Box, styled } from '@mui/material';

const DirGridLayout = styled(Box, { label: 'dir-grid-layout' })(({ theme }) => ({
  width: '100%',
  display: 'grid',
  [theme.breakpoints.up('xs')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(1, 1),
    padding: theme.spacing(3, 3),
  },
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(2, 2),
    padding: theme.spacing(4, 4),
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  [theme.breakpoints.up('xl')]: {
    gridTemplateColumns: 'repeat(5, 1fr)',
  },
}));

export default DirGridLayout;
