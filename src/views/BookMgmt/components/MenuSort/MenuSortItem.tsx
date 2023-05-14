import { ListItemIcon, styled } from '@mui/material';
import { RadioButtonCheckedRounded } from '@mui/icons-material';

import StyledMuiMenuItem from '@/components/Styled/MuiMenuItem';

import { MenuItemProps } from '@mui/material';

const MenuSortItem = styled((props: MenuItemProps) => (
  <StyledMuiMenuItem {...props}>
    <ListItemIcon>
      {props.selected && (
        <RadioButtonCheckedRounded fontSize="small" color="primary" />
      )}
    </ListItemIcon>
    {props.children}
  </StyledMuiMenuItem>
))({});

export default MenuSortItem;
