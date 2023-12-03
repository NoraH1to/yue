import useContextMenu from '@/hooks/useContextMenu';

import { FC, memo, useEffect } from 'react';

export type ContextMenuTriggerProps = {
  onOpen?: Parameters<typeof useContextMenu>[0];
  disabled?: boolean;
  children: React.ReactNode | ((...props: ReturnType<typeof useContextMenu>) => React.ReactNode);
};

const ContextMenuTrigger: FC<ContextMenuTriggerProps> = (props) => {
  const { onOpen, children, disabled = false } = props;
  const hookRes = useContextMenu(onOpen);
  useEffect(() => {
    hookRes[1].setDisabled(disabled);
  }, [disabled]);
  return <>{typeof children === 'function' ? children(...hookRes) : children}</>;
};

export const MemoContextMenuTrigger = memo(ContextMenuTrigger);

export default ContextMenuTrigger;
