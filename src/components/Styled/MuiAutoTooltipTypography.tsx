import useTextOverflowChecker from '@/hooks/useTextOverflowChecker';
import { Tooltip, TooltipProps } from '@mui/material';
import { FC, forwardRef, useCallback, useState } from 'react';
import MuiTypography, {
  StyledMuiTypographyProps,
} from '../Styled/MuiTypography';

const tooltipComponentsProps: TooltipProps['componentsProps'] = {
  tooltip: {
    sx: {
      userSelect: 'none',
    },
  },
};

export type StyledMuiAutoTooltipTypographyProps = StyledMuiTypographyProps &
  Pick<TooltipProps, 'placement'>;

const StyledMuiAutoTooltipTypography: FC<StyledMuiAutoTooltipTypographyProps> =
  forwardRef(({ placement, ...props }, fRef) => {
    const [ref, setRef] = useState<HTMLSpanElement | null>(null);
    const [isOverflow] = useTextOverflowChecker(ref);
    const _ref = useCallback(
      (el: HTMLSpanElement) => {
        setRef(el);
        if (!fRef) return;
        if (typeof fRef === 'function') fRef(el);
        else fRef.current = el;
      },
      [setRef, fRef],
    );
    const Content = <MuiTypography {...props} ref={_ref} />;
    return isOverflow ? (
      <Tooltip
        placement={placement}
        componentsProps={tooltipComponentsProps}
        title={props.children}>
        {Content}
      </Tooltip>
    ) : (
      Content
    );
  });

StyledMuiAutoTooltipTypography.displayName = 'ItemTitle';

export default StyledMuiAutoTooltipTypography;
