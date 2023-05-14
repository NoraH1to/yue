import { CardMedia, CardMediaProps } from '@mui/material';
import { memo } from 'react';

export type MemoMuiCardMediaProps = CardMediaProps;

const MemoMuiCardMedia = memo(CardMedia);

export default MemoMuiCardMedia;
