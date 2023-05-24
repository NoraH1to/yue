import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import StyledMuiMenuItem from '@/components/Styled/MuiMenuItem';
import useSorter from '@/hooks/useSorter';
import type { ISorter } from '@/modules/fs/Fs';
import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  SortRounded,
} from '@mui/icons-material';
import { Divider, ListItemIcon, ListItemText } from '@mui/material';
import { ReactNode, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuSort, { MenuSortProps } from '../MenuSort';
import MenuSortItem from '../MenuSort/MenuSortItem';

type Node<T extends object> =
  | ReactNode
  | ((
      sortKeys: Array<{ key: keyof T; title: string }>,
      ...args: ReturnType<typeof useSorter<T>>
    ) => ReactNode);

export type ToolbarButtonSortProps<T extends object> = Partial<
  MenuSortProps<T>
> & {
  onSort: (sorter: ISorter<T>) => void;
  defaultSorter: ISorter<T>;
  sortKeys: Array<{ key: keyof T; title: string }>;
  prepend?: Node<T>;
  append?: Node<T>;
};

const ToolbarButtonSort = <T extends object>({
  onSort,
  defaultSorter,
  sortKeys,
  prepend,
  append,
  ...props
}: ToolbarButtonSortProps<T>) => {
  const { t } = useTranslation();
  sortKeys = sortKeys || [];
  const useSorterRes = useSorter(
    `bookmgmt-toolbar-sorter-${window.location.pathname}`,
    sortKeys.map((s) => s.key),
    defaultSorter,
  );
  const [{ sorter, remember }, { toggleSorter, setSorterKey, setRemember }] =
    useSorterRes;
  useEffect(() => {
    onSort(sorter);
  }, [sorter]);
  // 排序菜单
  const [menuSortAnchorEl, setMenuSortAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const open = Boolean(menuSortAnchorEl);
  const handleClose = () => {
    setMenuSortAnchorEl(null);
  };
  const handleClickRemember = () => {
    setRemember((remember) => !remember);
  };

  const Remember = (
    <StyledMuiMenuItem onClick={handleClickRemember}>
      <ListItemIcon>
        {remember ? (
          <CheckBoxRounded color="primary" />
        ) : (
          <CheckBoxOutlineBlankRounded />
        )}
      </ListItemIcon>
      <ListItemText primary={t('remember setting')} />
    </StyledMuiMenuItem>
  );

  return (
    <>
      <StyledMuiIconButton
        onClick={(e) => setMenuSortAnchorEl(e.currentTarget)}>
        <SortRounded />
      </StyledMuiIconButton>
      <MenuSort
        {...props}
        open={open}
        sorter={sorter}
        onClose={handleClose}
        anchorEl={menuSortAnchorEl}
        onSortChange={(sort) => toggleSorter(sort)}
        append={Remember}>
        {typeof prepend === 'function'
          ? prepend(sortKeys, ...useSorterRes)
          : prepend}
        {prepend && <Divider />}
        {sortKeys.map((v) => (
          <MenuSortItem
            key={v.key as string}
            selected={sorter.key === v.key}
            onClick={() => {
              if (sorter.key !== v.key) setSorterKey(v.key);
              handleClose();
            }}>
            <ListItemText
              primary={v.title}
              primaryTypographyProps={{
                color: sorter.key === v.key ? 'primary' : undefined,
              }}
            />
          </MenuSortItem>
        ))}
        {append && <Divider />}
        {typeof append === 'function'
          ? append(sortKeys, ...useSorterRes)
          : append}
      </MenuSort>
    </>
  );
};

export default memo(ToolbarButtonSort) as unknown as typeof ToolbarButtonSort;
