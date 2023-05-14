import { useTranslation } from 'react-i18next';
import { Divider, ListItemText } from '@mui/material';

import StyledMuiMenu from '@/components/Styled/MuiMenu';
import MenuSortItem from './MenuSortItem';

import { ISorter } from '@/modules/fs/Fs';
import { MenuProps } from '@mui/material';
import { ReactNode } from 'react';

const MenuSort = <T extends object>(
  props: MenuProps & {
    sorter: ISorter<T>;
    onSortChange?: (newSorter: ISorter<T>['sort']) => void;
    append?: ReactNode;
  },
) => {
  const { t } = useTranslation();
  const { sorter, onSortChange, children, append, ...restProps } = props;
  return (
    <StyledMuiMenu {...restProps}>
      {children}
      <Divider key="$_divider_top" />
      {(['desc', 'asc'] as const).map((sort) => (
        <MenuSortItem
          key={`$_${sort}`}
          selected={sorter.sort === sort}
          onClick={() => {
            if (sorter.sort !== sort) onSortChange?.(sort);
            restProps.onClose?.({}, 'backdropClick');
          }}>
          <ListItemText
            primary={t(`sorter.${sort}`)}
            primaryTypographyProps={{
              color: sorter.sort === sort ? 'primary' : undefined,
            }}
          />
        </MenuSortItem>
      ))}
      {append && <Divider key="$_divider_bottom" />}
      {append}
    </StyledMuiMenu>
  );
};

export default MenuSort;
