import { StackProps, Stack } from '@mui/material';
import { FC } from 'react';

const BookDetailInfoItem: FC<StackProps> = (props) => (
  <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} {...props} />
);

export default BookDetailInfoItem;
