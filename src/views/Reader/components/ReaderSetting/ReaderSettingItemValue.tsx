import StyledMuiAutoTooltipTypography, {
  StyledMuiAutoTooltipTypographyProps,
} from '@/components/Styled/MuiAutoTooltipTypography';
import { FC } from 'react';

const ReaderSettingItemValue: FC<StyledMuiAutoTooltipTypographyProps> = ({
  ...props
}) => (
  <StyledMuiAutoTooltipTypography
    lineClampCount={1}
    variant="subtitle2"
    color="text.primary"
    textAlign="center"
    {...props}>
    {props.children}
  </StyledMuiAutoTooltipTypography>
);

export default ReaderSettingItemValue;
