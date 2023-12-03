import StyledMuiAutoTooltipTypography from '@/components/Styled/MuiAutoTooltipTypography';
import StyledMuiMenuItem from '@/components/Styled/MuiMenuItem';
import { CheckBox, CheckBoxOutlineBlankRounded } from '@mui/icons-material';
import { ListItemIcon, ListItemSecondaryAction } from '@mui/material';
import { FC, ReactNode } from 'react';

export type FilterItemProps = {
  title: string | ReactNode;
  append?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

const FilterItem: FC<FilterItemProps> = ({ title, append, selected, onClick }) => {
  const color = selected ? 'primary' : undefined;
  const Icon = selected ? CheckBox : CheckBoxOutlineBlankRounded;
  return (
    <StyledMuiMenuItem selected={selected} onClick={onClick}>
      <ListItemIcon>
        <Icon color={color} />
      </ListItemIcon>
      <StyledMuiAutoTooltipTypography
        // 很怪，如果是 -webkit-box 省略号不会生效
        placement="left"
        display="unset !important"
        lineClampCount={1}
        width={0}
        flexGrow={1}>
        {title}
      </StyledMuiAutoTooltipTypography>
      {append && <ListItemSecondaryAction>{append}</ListItemSecondaryAction>}
    </StyledMuiMenuItem>
  );
};

export default FilterItem;
