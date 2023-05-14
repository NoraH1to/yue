import { ReactNode, forwardRef } from 'react';
import {
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  useTheme,
} from '@mui/material';

import Dot from '@/components/Dot';
import StyledMuiListItemButton from '@/components/Styled/MuiListItemButton';

import { FC } from 'react';
import { ListItemButtonProps } from '@mui/material';
import { TFsTag } from '@/modules/fs/Fs';

const TagListItem: FC<
  { tag: TFsTag; prefix?: ReactNode } & ListItemButtonProps
> = forwardRef(({ tag, prefix, ...props }, ref) => {
  const theme = useTheme();
  return (
    <StyledMuiListItemButton {...props} ref={ref}>
      {prefix}
      <ListItemText
        primary={
          <Typography
            variant="subtitle2"
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            sx={{ pr: theme.spacing(2) }}>
            {tag.title}
          </Typography>
        }></ListItemText>
      {tag.color && (
        <ListItemSecondaryAction>
          <Dot color={tag.color} size={theme.spacing(1)} />
        </ListItemSecondaryAction>
      )}
    </StyledMuiListItemButton>
  );
});
TagListItem.displayName = 'TagListItem';

export default TagListItem;
