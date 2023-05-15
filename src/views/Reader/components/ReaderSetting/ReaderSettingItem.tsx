import StyledMuiAutoTooltipTypography from '@/components/Styled/MuiAutoTooltipTypography';
import { Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export type ReaderSettingItemProps = PropsWithChildren<{
  title: string;
}>;

const ReaderSettingItem: FC<ReaderSettingItemProps> = ({ title, children }) => {
  return (
    <Stack sx={{ userSelect: 'none' }}>
      <StyledMuiAutoTooltipTypography
        variant="body1"
        color="text.secondary"
        width={1}
        textAlign="center"
        lineClampCount={1}>
        {title}
      </StyledMuiAutoTooltipTypography>
      {children}
    </Stack>
  );
};

export default ReaderSettingItem;
