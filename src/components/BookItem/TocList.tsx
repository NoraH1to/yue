import { IToc } from '@/modules/book/Toc';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  List,
  ListItemText,
  ListProps,
} from '@mui/material';
import { FC, Fragment, memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContextMenuTrigger from '../ContextMenu/Trigger';
import StatusWrapper from '../StatusWrapper';
import StatusTypography from '../StatusWrapper/StatusTypography';
import StyledMuiListItemButton from '../Styled/MuiListItemButton';

export type TocListProps = {
  tocList: IToc[];
  current?: IToc;
  currentTitle?: string;
  onClickToc?: (toc: IToc) => void;
  deep?: number;
} & ListProps;

const hasChildProcess = (target?: IToc, children?: IToc[]): boolean => {
  if (!children || !target) return false;
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
  const { t } = useTranslation();
  const [collapseMap, setCollapseMap] = useState<Record<string, boolean>>({});
  const handleToggleCollapse = (toc: IToc, open?: boolean) => {
    setCollapseMap((collapseMap) => ({
      ...collapseMap,
      [toc.href]: open === undefined ? !collapseMap[toc.href] : open,
    }));
  };
  const currentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!currentRef.current) return;
    currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [tocList, current]);
  return deep === 0 && !tocList.length ? (
    <StatusWrapper>
      <StatusTypography>{t('empty toc')}</StatusTypography>
    </StatusWrapper>
  ) : (
    <List {...restProps}>
      {tocList.map((toc) => {
        const Icon = collapseMap[toc.href]
          ? ExpandLessRounded
          : ExpandMoreRounded;
        const isChildrenSelected = hasChildProcess(current, toc.children);
        const selected =
          current && (current.href === toc.href || isChildrenSelected);
        if (selected && isChildrenSelected && !collapseMap[toc.href]) {
          handleToggleCollapse(toc, true);
        }
        return (
          <Fragment key={toc.href}>
            <ContextMenuTrigger
              onOpen={() => handleToggleCollapse(toc)}
              disabled={!toc.children?.length}>
              {({ triggerProps, longPressTimer }) => (
                <StyledMuiListItemButton
                  ref={selected && !isChildrenSelected ? currentRef : undefined}
                  sx={{ pl: 2 + 2 * deep }}
                  {...triggerProps}
                  selected={selected}
                  onClick={() => {
                    if (longPressTimer.current) return;
                    onClickToc?.(toc);
                  }}>
                  <ListItemText
                    primary={toc.title}
                    secondary={selected && !isChildrenSelected && currentTitle}
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
