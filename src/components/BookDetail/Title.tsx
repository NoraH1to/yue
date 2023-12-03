import { Skeleton } from '@mui/material';
import { FC, ReactNode, forwardRef } from 'react';
import { Overwrite } from 'utility-types';
import StyledMuiAutoTooltipTypography, {
  StyledMuiAutoTooltipTypographyProps,
} from '../Styled/MuiAutoTooltipTypography';

export const BookDetailTitleSkeleton = () => (
  <Skeleton animation="wave" height="32px" width="200px" variant="rounded" />
);

export type BookDetailTitleProps = Overwrite<
  StyledMuiAutoTooltipTypographyProps,
  {
    title: string | ReactNode;
  }
>;

const BookDetailTitle: FC<BookDetailTitleProps> = forwardRef(({ title, ...props }, ref) => (
  <StyledMuiAutoTooltipTypography
    variant="h5"
    fontWeight={100}
    color="text.primary"
    lineClampCount={1}
    ref={ref}
    {...props}>
    {title}
  </StyledMuiAutoTooltipTypography>
));

BookDetailTitle.displayName = 'BookDetailTitle';

export default BookDetailTitle;
