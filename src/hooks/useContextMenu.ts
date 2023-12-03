import { useCallback, useEffect, useRef, useState } from 'react';

function whenTouchOrPen<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType !== 'mouse' ? handler(event) : undefined);
}

const useContextMenu = <
  T extends React.DOMAttributes<HTMLElement> = React.DOMAttributes<HTMLElement>,
>(
  onOpen?: (position: { x: number; y: number }) => void,
) => {
  const [disabled, setDisabled] = useState(false);
  const position = useRef({ x: -999, y: -999 });

  const whenEnable = useCallback(
    function <E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
      return (event) => (!disabled ? handler(event) : undefined);
    },
    [disabled],
  );

  useEffect(() => {
    if (disabled) clearLongPress();
  }, [disabled]);

  const handleOpen = useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
      onOpen?.({ ...position.current });
    },
    [onOpen],
  );

  const longPressTimer = useRef(0);
  const clearLongPress = useCallback(() => {
    window.clearTimeout(longPressTimer.current);
    longPressTimer.current = 0;
  }, []);

  const onContextMenu = useCallback<NonNullable<T['onContextMenu']>>(
    whenEnable((e) => {
      // 大部分触控平台都支持长按触发 `contextmenu` 事件，清除计时器
      clearLongPress();
      handleOpen(e);
      e.preventDefault();
    }),
    [whenEnable, clearLongPress, handleOpen],
  );

  const onPointerDown = useCallback<NonNullable<T['onPointerDown']>>(
    whenEnable(
      whenTouchOrPen((e) => {
        clearLongPress();
        // 在触发 iOS 跨应用拽托前响应，500ms 比较合适
        longPressTimer.current = window.setTimeout(() => handleOpen(e), 600);
      }),
    ),
    [whenEnable, clearLongPress, handleOpen],
  );

  const onPointerMove: T['onPointerMove'] = useCallback(
    whenEnable(whenTouchOrPen(clearLongPress)),
    [whenEnable, clearLongPress],
  );

  const onPointerCancel: T['onPointerCancel'] = useCallback(
    whenEnable(whenTouchOrPen(clearLongPress)),
    [whenEnable, clearLongPress],
  );

  const onPointerUp: T['onPointerUp'] = useCallback(whenEnable(whenTouchOrPen(clearLongPress)), [
    whenEnable,
    clearLongPress,
  ]);

  return [
    {
      triggerProps: {
        onContextMenu,
        onPointerDown,
        onPointerMove,
        onPointerCancel,
        onPointerUp,
      },
      longPressTimer,
      position: position.current,
    },
    { setDisabled },
  ] as const;
};

export default useContextMenu;
