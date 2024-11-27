import React from 'react';
import { TextField } from '@mui/material';

const FormInput = ({
  label,
  value,
  onChange,
  type = 'text',
  error = false,
  helperText = '',
  fullWidth = true,
  margin = 'normal',
  variant = 'outlined',
  ariaLabel,
  ...props
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      error={!!error}
      helperText={helperText}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      aria-label={ariaLabel || label}
      {...props}
    />
  );
};

export default FormInput;
