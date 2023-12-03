import StyledMuiAutoTooltipTypography, {
  StyledMuiAutoTooltipTypographyProps,
} from '@/components/Styled/MuiAutoTooltipTypography';
import { FC } from 'react';

const BookDetailInfoItemText: FC<StyledMuiAutoTooltipTypographyProps> = (props) => (
  <StyledMuiAutoTooltipTypography variant="subtitle2" lineClampCount={1} {...props} />
);

export default BookDetailInfoItemText;
