import { Box } from '@mui/material';
import { BoxProps } from '@mui/system';
import Hammer from 'hammerjs';
import { FC, PropsWithChildren, memo, useEffect, useState } from 'react';

export type GestureLayerProps = PropsWithChildren<
  BoxProps & {
    onPageNext: () => void;
    onPagePrev: () => void;
    onOpenAction: () => void;
  }
>;

const GestureLayer: FC<GestureLayerProps> = ({
  children,
  onPageNext,
  onPagePrev,
  onOpenAction,
  ...props
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const handleTapContent: HammerListener = (e) => {
    const {
      center: { x, y },
    } = e;
    const target = e.target as HTMLDivElement;
    const width = target.clientWidth;
    const height = target.clientHeight;
    const centerXStart = width / 3;
    const centerXEnd = centerXStart * 2;
    const centerYStart = height / 4;
    const centerYEnd = centerYStart * 3;
    if (x < centerXStart || x > centerXEnd || y < centerYStart || y > centerYEnd) {
      if (x > width / 2) onPageNext();
      else onPagePrev();
    } else onOpenAction();
  };
  useEffect(() => {
    if (!container) return;
    const hammer = new Hammer(container);
    hammer.on('vertical swipe', (e) => {
      e.deltaX < 0 ? onPageNext() : onPagePrev();
    });
    hammer.on('tap', handleTapContent);
    const preventGhostClick = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    /**
     * 防止 ghost click（幽灵点击）事件触发
     * hammer 添加监听后，在同一个 dom 上阻止 `touchend` 事件即可
     */
    container.addEventListener('touchend', preventGhostClick);
    return () => {
      hammer.destroy();
      container.removeEventListener('touchend', preventGhostClick);
    };
  }, [container, handleTapContent]);
  return (
    <Box {...props} ref={setContainer}>
      {children}
    </Box>
  );
};

export default memo(GestureLayer);
