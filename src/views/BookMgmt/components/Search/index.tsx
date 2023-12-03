import { Box, IconButton, InputAdornment, InputBase, Stack, styled } from '@mui/material';
import { CloseRounded, SearchRounded } from '@mui/icons-material';

import { FC } from 'react';
import { InputBaseProps } from '@mui/material';

const SearchContainer = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.action.hover,
  padding: theme.spacing(0, 1.5),
  '& .MuiIconButton-root': {
    opacity: 0,
  },
  '&:hover': {
    background: theme.palette.action.focus,
    '.MuiIconButton-root': {
      opacity: 1,
    },
  },
}));

const Search: FC<InputBaseProps & { onClear?: () => void }> = ({ onClear, ...props }) => {
  return (
    <SearchContainer>
      <Stack sx={{ height: 1 }} direction="row" gap={1} alignItems="center">
        <SearchRounded color="disabled" fontSize="small" />
        <InputBase
          {...props}
          endAdornment={
            <InputAdornment position="end">
              <IconButton size="small" edge="end" onClick={onClear}>
                <CloseRounded fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
        />
      </Stack>
    </SearchContainer>
  );
};

export default Search;
