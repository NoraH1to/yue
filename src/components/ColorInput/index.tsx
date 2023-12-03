import { Box, InputAdornment, Paper, Popover, TextField } from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

import { ComponentProps } from 'react';
import { TextFieldProps } from '@mui/material';
import StyledMuiIconButton from '../Styled/MuiIconButton';

const ColorInput = (props: TextFieldProps) => {
  const [pickerAnchorEl, setPickerAnchorEl] = useState<HTMLElement | null>(null);
  const [_value, setValue] = useState<string>((props.value as string) || '');

  const controlled = Object.hasOwn(props, 'value');

  const value = controlled ? (props.value as string) : _value;

  const onChange: ComponentProps<typeof HexColorPicker>['onChange'] & TextFieldProps['onChange'] = (
    e,
    ...args
  ) => {
    if (typeof e === 'string') {
      !controlled && setValue(e);
      props.onChange?.({ target: { value: e, name: props.name || '' } } as any); // 兼容 formik
    } else {
      !controlled && setValue(e.target.value);
      props.onChange?.(e, ...args);
    }
  };

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Popover
              open={Boolean(pickerAnchorEl)}
              anchorEl={pickerAnchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              onClose={() => setPickerAnchorEl(null)}>
              <Paper sx={{ p: 2 }}>
                <HexColorPicker color={value} onChange={onChange} />
              </Paper>
            </Popover>

            <StyledMuiIconButton
              sx={(theme) => ({
                padding: theme.spacing(0),
                overflow: 'hidden',
              })}
              onClick={(e) => {
                setPickerAnchorEl(pickerAnchorEl ? null : (e.target as HTMLElement));
              }}>
              <Box sx={{ backgroundColor: value, width: 1, height: 1 }}></Box>
            </StyledMuiIconButton>
          </InputAdornment>
        ),
      }}
      {...props}
      onChange={onChange}
      value={value}
    />
  );
};

export default ColorInput;
