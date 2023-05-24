import StyledMuiMenu from '@/components/Styled/MuiMenu';
import { ISorter } from '@/modules/fs/Fs';
import { Divider, ListItemText, MenuProps } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSortItem from './MenuSortItem';

export type MenuSortProps<T extends object> = MenuProps & {
  sorter: ISorter<T>;
  onSortChange?: (newSorter: ISorter<T>['sort']) => void;
  append?: ReactNode;
};

const MenuSort = <T extends object>(props: MenuSortProps<T>) => {
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
