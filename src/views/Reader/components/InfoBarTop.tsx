import { formatTime } from '@/helper';
import { Stack, Typography } from '@mui/material';
import { useInterval } from 'ahooks';
import { FC, memo, useCallback, useState } from 'react';

export type InfoBarTopProps = {
  title?: string;
  color?: string;
};

const InfoBarTop: FC<InfoBarTopProps> = ({ title, color }) => {
  const [time, setTime] = useState(formatTime('HH:mm'));
  useInterval(
    useCallback(() => setTime(formatTime('HH:mm')), []),
    2000,
  );
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      px={1.5}
      py={0.6}
      sx={{ userSelect: 'none' }}>
      <Typography variant="caption" color={color}>
        {title}
      </Typography>
      <Typography variant="caption" color={color}>
        {time}
      </Typography>
    </Stack>
  );
};

export default memo(InfoBarTop);
