import { Box } from '@mui/material';
import { FC, memo } from 'react';

const MemoImgViewer: FC<{ img: File }> = memo(({ img }) => {
  return (
    <Box
      component="img"
      height={1}
      width={1}
      sx={{ objectFit: 'contain' }}
      src={URL.createObjectURL(img)}
    />
  );
});

MemoImgViewer.displayName = 'MemoImgViewer';

export default MemoImgViewer;
