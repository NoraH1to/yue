import { SwipeableDrawer, SwipeableDrawerProps, styled } from '@mui/material';

const StyledMuiSwipeableDrawer = styled(
  (props: SwipeableDrawerProps) => (
    <SwipeableDrawer
      {...props}
      PaperProps={{
        ...props.PaperProps,
        sx: [
          (theme) => {
            const { anchor = 'left' } = props;
            return {
              borderRadius: theme.shape.borderRadius * 1,
              borderTopRightRadius:
                anchor === 'top' || anchor === 'right' ? 0 : undefined,
              borderTopLeftRadius:
                anchor === 'top' || anchor === 'left' ? 0 : undefined,
              borderBottomRightRadius:
                anchor === 'bottom' || anchor === 'right' ? 0 : undefined,
              borderBottomLeftRadius:
                anchor === 'bottom' || anchor === 'left' ? 0 : undefined,
            };
          },
          ...(Array.isArray(props.PaperProps?.sx) ? props.PaperProps!.sx : []),
          props.PaperProps?.sx,
        ],
      }}
    />
  ),
  {
    label: 'styled-mui-swipeable-drawer',
  },
)({});

export default StyledMuiSwipeableDrawer;
