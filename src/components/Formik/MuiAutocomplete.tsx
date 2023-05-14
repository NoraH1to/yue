import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import { useField } from 'formik';

import { TextFieldProps } from '@mui/material';
import { FieldHookConfig } from 'formik';

const MuiAutocomplete = <
  T,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(
  props: TextFieldProps &
    Pick<
      AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
      | 'multiple'
      | 'id'
      | 'options'
      | 'getOptionLabel'
      | 'defaultValue'
      | 'isOptionEqualToValue'
      | 'value'
      | 'loading'
      | 'onChange'
      | 'forcePopupIcon'
      | 'clearOnBlur'
    >,
) => {
  const {
    multiple,
    id,
    options,
    getOptionLabel,
    defaultValue,
    isOptionEqualToValue,
    loading,
    sx,
    forcePopupIcon,
    clearOnBlur,
    ...restProps
  } = props;
  const [{ onChange, ...field }, meta] = useField(
    restProps as FieldHookConfig<(typeof restProps)['value']>,
  );
  return (
    <Autocomplete
      {...field}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
      multiple={multiple}
      id={id}
      forcePopupIcon={forcePopupIcon}
      options={options}
      getOptionLabel={getOptionLabel}
      defaultValue={defaultValue}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      clearOnBlur={clearOnBlur}
      onChange={(e, v) => onChange({ target: { value: v, name: props.name } })}
      renderInput={(p) => (
        <TextField
          {...p}
          {...restProps}
          inputProps={{ ...p.inputProps, ...restProps.inputProps }}
          InputProps={{ ...p.InputProps, ...restProps.InputProps }}
          name={field.name}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error}
        />
      )}
    />
  );
};

export default MuiAutocomplete;
