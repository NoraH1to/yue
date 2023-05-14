import { Box, styled } from '@mui/material';

const BookGridLayout = styled(Box, { label: 'book-grid-layout' })(
  ({ theme }) => ({
    width: '100%',
    display: 'grid',
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: `${theme.spacing(3)} ${theme.spacing(3)}`,
      padding: theme.spacing(0, 3, 3),
    },
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: `${theme.spacing(5)} ${theme.spacing(3)}`,
      padding: theme.spacing(1, 4, 4),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
    placeContent: 'start start',
  }),
);

export default BookGridLayout;
