import { TextField } from '@mui/material';
import { useField } from 'formik';

import { TextFieldProps } from '@mui/material';
import { FieldHookConfig } from 'formik';

const MuiTextFiled = (props: TextFieldProps) => {
  const [field, meta] = useField(props as FieldHookConfig<string>);
  return (
    <TextField
      {...props}
      {...field}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
    />
  );
};

export default MuiTextFiled;
