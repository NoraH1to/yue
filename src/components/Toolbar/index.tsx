import {
  AppBarProps,
  Toolbar as MToolbar,
  ToolbarProps as MToolbarProps,
} from '@mui/material';
import { FC, forwardRef } from 'react';
import MuiAppBar from '../Styled/MuiAppBar';

export type ToolbarProps = AppBarProps & {
  toolbarVariant?: MToolbarProps['variant'];
};

const Toolbar: FC<ToolbarProps> = forwardRef(
  ({ toolbarVariant, ...props }, ref) => {
    return (
      <MuiAppBar
        position="static"
        variant="outlined"
        elevation={0}
        {...props}
        ref={ref}>
        <MToolbar variant={toolbarVariant}>{props.children}</MToolbar>
      </MuiAppBar>
    );
  },
);

Toolbar.displayName = 'MainToolbar';

export default Toolbar;
