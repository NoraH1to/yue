import { Box } from '@mui/material';

import { FC } from 'react';

const Dot: FC<{ size?: string | number; color?: string }> = ({ size, color }) => (
  <Box
    sx={[
      {
        fontSize: 0,
        background: color,
        borderRadius: '50%',
      },
      (theme) => ({
        width: size ?? theme.spacing(0.8),
        height: size ?? theme.spacing(0.8),
      }),
    ]}
  />
);

export default Dot;
