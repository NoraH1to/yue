import { Backdrop, CircularProgress } from '@mui/material';
import { FC, memo } from 'react';

export type LoadingLayerProps = { open: boolean };

const LoadingLayer: FC<LoadingLayerProps> = ({ open }) => {
  return (
    <Backdrop open={open}>
      <CircularProgress />
    </Backdrop>
  );
};

export default memo(LoadingLayer);
