import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import useSorter from '@/hooks/useSorter';
import { SortRounded } from '@mui/icons-material';
import { Divider, ListItemText } from '@mui/material';
import { ReactNode, memo, useEffect, useState } from 'react';
import MenuSort from '../MenuSort';
import MenuSortItem from '../MenuSort/MenuSortItem';

import type { ISorter } from '@/modules/fs/Fs';

export type ToolbarButtonSortProps<T extends object> = {
  onSort: (sorter: ISorter<T>) => void;
  defaultSorter: ISorter<T>;
  sortKeys: Array<{ key: keyof T; title: string }>;
  prepend?:
    | ReactNode
    | ((
        sortKeys: Array<{ key: keyof T; title: string }>,
        ...args: ReturnType<typeof useSorter<T>>
      ) => ReactNode);
  append?: ToolbarButtonSortProps<T>['prepend'];
};

const ToolbarButtonSort = <T extends object>({
  onSort,
  defaultSorter,
  sortKeys,
  prepend,
  append,
}: ToolbarButtonSortProps<T>) => {
  sortKeys = sortKeys || [];
  const useSorterRes = useSorter(
    sortKeys.map((s) => s.key),
    defaultSorter,
  );
  const [{ sorter }, { toggleSorter, setSorterKey }] = useSorterRes;
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
  return (
    <>
      <StyledMuiIconButton
        onClick={(e) => setMenuSortAnchorEl(e.currentTarget)}>
        <SortRounded />
      </StyledMuiIconButton>
      <MenuSort
        open={open}
        sorter={sorter}
        onClose={handleClose}
        anchorEl={menuSortAnchorEl}
        onSortChange={(sort) => toggleSorter(sort)}>
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

export default memo(ToolbarButtonSort) as typeof ToolbarButtonSort;
