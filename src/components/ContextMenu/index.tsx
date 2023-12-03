import { Popover } from '@mui/material';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { mergeEventListener } from '@/helper';
import useEventsAway from '@/hooks/useEventsAway';

import { PopoverProps } from '@mui/material';
import { FC, ReactNode } from 'react';

export type ContextMenuProps = PopoverProps & {
  x: number;
  y: number;
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
};

const ContextMenu: FC<ContextMenuProps> = ({ y, x, children, ...props }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [_, { setActive }] = useEventsAway(() => {
    props.onClose?.();
  }, ref);
  useEffect(() => {
    setActive(props.open);
  }, [props.open]);
  return createPortal(
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={{ left: x, top: y }}
      {...props}
      sx={[
        {
          pointerEvents: 'none',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
      PaperProps={{
        ref,
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
        },
        onContextMenu: (e) => e.preventDefault(),
        ...props.PaperProps,
        sx: [
          { pointerEvents: 'all' },
          (theme) => ({
            borderRadius: theme.shape.borderRadius * 0.75,
            padding: theme.spacing(1),
            zIndex: theme.zIndex.modal,
          }),
          ...(Array.isArray(props.PaperProps?.sx) ? props.PaperProps!.sx : [props.PaperProps?.sx]),
        ],
      }}
      onContextMenu={mergeEventListener((e) => e.preventDefault(), props.onContextMenu)}
      TransitionProps={{ unmountOnExit: true, ...props.TransitionProps }}>
      {children}
    </Popover>,
    document.body,
  );
};

export default ContextMenu;
