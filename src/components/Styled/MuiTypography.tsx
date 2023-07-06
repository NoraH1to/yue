import { Typography, TypographyProps, styled } from '@mui/material';
import { forwardRef } from 'react';

export type StyledMuiTypographyProps = TypographyProps & {
  lineClampCount?: number;
};

const Styled = forwardRef<HTMLSpanElement | null, StyledMuiTypographyProps>(
  ({ lineClampCount, ...props }, ref) => <Typography ref={ref} {...props} />,
);

Styled.displayName = 'StyledMuiTypography';

const StyledMuiTypography = styled(Styled)(({ lineClampCount }) => [
  lineClampCount && {
    display: '-webkit-box',
    WebkitLineClamp: lineClampCount,
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
]);

export default StyledMuiTypography;
