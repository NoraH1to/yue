import { useField } from 'formik';

import ColorInput from '../ColorInput';

import { FieldHookConfig } from 'formik';
import { TextFieldProps } from '@mui/material';

const MuiColorInput = (props: TextFieldProps) => {
  const [field, meta] = useField(props as FieldHookConfig<string>);

  return (
    <ColorInput
      {...props}
      {...field}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
    />
  );
};

export default MuiColorInput;
