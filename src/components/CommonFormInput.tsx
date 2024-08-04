import React, { ChangeEvent, FC } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

interface CommonFormInputProps {
  type?: string;
  label: string;
  value: string | number | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  options?: { value: number; label: string }[];
  fullWidth?: boolean;
  required?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
}

const CommonFormInput: FC<CommonFormInputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  required = true,
  variant = 'outlined',
}) => {
  if (options) {
    return (
      <FormControl variant={variant} margin="dense" fullWidth={fullWidth} required={required}>
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange} label={label}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      variant={variant}
      required={required}
      fullWidth={fullWidth}
      label={label}
      type={type}
      value={value}
      margin="dense"
      onChange={onChange}
    />
  );
};

export default CommonFormInput;
