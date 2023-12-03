import Dot from '@/components/Dot';
import StyledMuiIconButton from '@/components/Styled/MuiIconButton';
import StyledMuiMenu from '@/components/Styled/MuiMenu';
import { delFalsy } from '@/helper';
import useStatusLiveQuery from '@/hooks/useStatusLiveQuery';
import fs from '@/modules/fs';
import { TFsTag } from '@/modules/fs/Fs';
import { FilterListRounded } from '@mui/icons-material';
import { ButtonProps, Divider } from '@mui/material';
import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterItem from './FilterItem';

export interface IFilter {
  tag: Record<string, boolean>;
  hasNotTag?: true;
}

export type ToolbarButtonFilterProps = PropsWithChildren<{
  onFilter?: (filter: IFilter, hasFilter: boolean) => void;
}>;

const ToolbarButtonFilter: FC<ToolbarButtonFilterProps> = ({ children, onFilter }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClickButton = useCallback<NonNullable<ButtonProps['onClick']>>(
    (e) => {
      setAnchorEl(e.target as HTMLButtonElement);
    },
    [setAnchorEl],
  );
  const handleCloseMenu = useCallback(() => setAnchorEl(null), [setAnchorEl]);
  const open = !!anchorEl;
  const { data: tags } = useStatusLiveQuery(() => fs.getTags(), undefined, null);
  const [filter, setFilter] = useState<IFilter>({
    tag: {} as Record<string, boolean>,
  });
  const handleSelectNotTag = useCallback(() => {
    // @ts-ignore
    setFilter((filter) =>
      delFalsy({
        tag: {},
        hasNotTag: !filter?.hasNotTag,
      }),
    );
  }, [setFilter]);
  const handleSelectTag = useCallback(
    (tag: TFsTag) => {
      setFilter((filter) => {
        return {
          tag: delFalsy({ ...filter.tag, [tag.id]: !filter.tag[tag.id] }),
        };
      });
    },
    [setFilter],
  );
  useEffect(() => {
    onFilter?.(filter, !!(Object.keys(filter.tag).length > 0 || filter.hasNotTag));
  }, [filter]);
  return (
    <>
      <StyledMuiIconButton onClick={handleClickButton}>
        <FilterListRounded />
      </StyledMuiIconButton>
      <StyledMuiMenu open={open} anchorEl={anchorEl} onClose={handleCloseMenu}>
        {children}
        <FilterItem
          title={t('no tag')}
          selected={!!filter.hasNotTag}
          onClick={handleSelectNotTag}
        />
        {tags && tags.length > 0 && <Divider />}
        {tags?.map((tag) => (
          <FilterItem
            key={tag.id}
            title={tag.title}
            selected={!!filter.tag[tag.id]}
            append={<Dot color={tag.color} />}
            onClick={() => handleSelectTag(tag)}
          />
        ))}
      </StyledMuiMenu>
    </>
  );
};

export default ToolbarButtonFilter;
