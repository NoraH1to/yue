import { IToc } from '@/modules/book/Toc';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  List,
  ListItemText,
  ListProps,
} from '@mui/material';
import { FC, Fragment, memo, useState } from 'react';
import ContextMenuTrigger from '../ContextMenu/Trigger';
import StyledMuiListItemButton from '../Styled/MuiListItemButton';

export type TocListProps = {
  tocList: IToc[];
  current?: IToc;
  currentTitle?: string;
  onClickToc?: (toc: IToc) => void;
  deep?: number;
} & ListProps;

const hasChildProcess = (target: IToc, children?: IToc[]): boolean => {
  if (!children) return false;
  return children.some((child) => {
    return (
      child.href === target.href || hasChildProcess(target, child.children)
    );
  });
};

const TocList: FC<TocListProps> = (props) => {
  const {
    tocList,
    current,
    currentTitle,
    onClickToc,
    deep = 0,
    ...restProps
  } = props;
  const [collapseMap, setCollapseMap] = useState<Record<string, boolean>>({});
  const handleToggleCollapse = (toc: IToc) => {
    setCollapseMap((collapseMap) => ({
      ...collapseMap,
      [toc.href]: !collapseMap[toc.href],
    }));
  };
  return (
    <List {...restProps}>
      {tocList.map((toc) => {
        const Icon = collapseMap[toc.href]
          ? ExpandLessRounded
          : ExpandMoreRounded;
        const selected =
          current &&
          (current.href === toc.href || hasChildProcess(current, toc.children));
        return (
          <Fragment key={toc.href}>
            <ContextMenuTrigger
              onOpen={() => handleToggleCollapse(toc)}
              disabled={!toc.children?.length}>
              {({ triggerProps, longPressTimer }) => (
                <StyledMuiListItemButton
                  sx={{ pl: 2 + 2 * deep }}
                  {...triggerProps}
                  selected={selected}
                  onClick={() => {
                    if (longPressTimer.current) return;
                    onClickToc?.(toc);
                  }}>
                  <ListItemText
                    primary={toc.title}
                    secondary={selected && currentTitle}
                  />
                  {!!toc.children?.length && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCollapse(toc);
                      }}
                      sx={{ p: 0.5 }}>
                      <Icon />
                    </IconButton>
                  )}
                </StyledMuiListItemButton>
              )}
            </ContextMenuTrigger>
            {!!toc.children?.length && (
              <Collapse in={collapseMap[toc.href]}>
                <TocList {...props} tocList={toc.children} deep={deep + 1} />
              </Collapse>
            )}
          </Fragment>
        );
      })}
    </List>
  );
};

export const MemoTocList = memo(TocList);

export default TocList;
