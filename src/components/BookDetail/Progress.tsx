import { multiply } from '@/helper';
import { Box, LinearProgress, Stack } from '@mui/material';
import { FC, memo } from 'react';
import BookDetailInfoItemText from './InfoItemText';

export type BookDetailProgressProps = {
  percent: number;
};

const BookDetailProgress: FC<BookDetailProgressProps> = ({ percent }) => {
  const value = multiply(percent, 100);
  return (
    <Stack direction="row" alignItems="center" gap={1} width={1}>
      <Box flexGrow={1}>
        <LinearProgress variant="determinate" value={value || 0} />
      </Box>
      <BookDetailInfoItemText
        variant="body1"
        color="text.secondary"
        flexShrink={0}>
        {`${value.toFixed(1)}%`}
      </BookDetailInfoItemText>
    </Stack>
  );
};

export const MemoBookDetailProgress = memo(BookDetailProgress);

export default BookDetailProgress;
