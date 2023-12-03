import { Stack, Typography } from '@mui/material';
import { FC, memo } from 'react';

export type InfoBarBottomProps = {
  pages?: number;
  currentPage?: number;
  color?: string;
};

const InfoBarBottom: FC<InfoBarBottomProps> = ({ pages, currentPage, color }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      px={1.5}
      py={0.6}
      sx={{ userSelect: 'none' }}>
      <Typography variant="caption" color={color}>
        {pages !== undefined && currentPage !== undefined && `${currentPage}/${pages}`}
      </Typography>
      <Typography variant="caption" color={color}></Typography>
    </Stack>
  );
};

export default memo(InfoBarBottom);
