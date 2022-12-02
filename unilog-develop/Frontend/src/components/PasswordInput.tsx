import { EuiFieldPassword, EuiFormRow } from '@elastic/eui';
import React from 'react';
import { FieldError } from 'react-hook-form';

interface PasswordInputProps {
  label: string;
  name: string;
  inputRef: (instance: HTMLInputElement | null) => void;
  disabled: boolean;
  error?: FieldError;
}
export default function PasswordInput(props: PasswordInputProps) {
  const { label, name, inputRef, disabled, error } = props;

  return (
    <EuiFormRow
      label={label}
      isInvalid={Boolean(error)}
      error={error?.message || error?.type}
      style={{ height: '70px' }}
    >
      <EuiFieldPassword
        name={name}
        type="dual"
        inputRef={inputRef}
        disabled={disabled}
        isInvalid={Boolean(error)}
      />
    </EuiFormRow>
  );
}
