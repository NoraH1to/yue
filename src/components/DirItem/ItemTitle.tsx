import { FC, memo } from 'react';
import MuiAutoTooltipTypography from '../Styled/MuiAutoTooltipTypography';
import { StyledMuiTypographyProps } from '../Styled/MuiTypography';

const ItemTitle: FC<StyledMuiTypographyProps> = (props) => (
  <MuiAutoTooltipTypography textAlign="center" variant="subtitle1" lineClampCount={2} {...props} />
);

ItemTitle.displayName = 'ItemTitle';

export const MemoItemTitle = memo(ItemTitle);

export default ItemTitle;
