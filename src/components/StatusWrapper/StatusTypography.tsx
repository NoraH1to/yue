import { Typography, TypographyProps } from '@mui/material';
import { FC } from 'react';

export type StatusTypographyProps = TypographyProps;

const StatusTypography: FC<StatusTypographyProps> = (restProps) => (
  <Typography variant="h5" color="text.secondary" {...restProps} />
);

export default StatusTypography;
