import Toolbar from '@/components/Toolbar';
import { ArrowBackRounded } from '@mui/icons-material';
import { Box, Fade, IconButton, Skeleton } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BookDetailTitle from './BookDetail/Title';

export const DetailToolbarTitleSkeleton = () => (
  <Skeleton animation="wave" height="32px" width="200px" variant="rounded" />
);

export type DetailToolbarProps = {
  title?: string | ReactNode;
  onBack?: () => void;
};

const DetailToolbar: FC<DetailToolbarProps> = ({ title, onBack }) => {
  const nav = useNavigate();
  const _onBack = () => nav(-1);
  return (
    <Toolbar
      variant="elevation"
      elevation={0}
      sx={{ backgroundColor: 'transparent', backdropFilter: 'none' }}>
      <IconButton onClick={onBack || _onBack}>
        <ArrowBackRounded />
      </IconButton>
      <Box px={2}>
        <Fade in>
          <BookDetailTitle title={title} />
        </Fade>
      </Box>
    </Toolbar>
  );
};

export default DetailToolbar;
