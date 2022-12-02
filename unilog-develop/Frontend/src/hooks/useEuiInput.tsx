import { useState, ChangeEventHandler } from 'react';

export function useEuiInput(initValue = '') {
  const [value, setValue] = useState(initValue);

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { value } = e.target;
    setValue(value);
  };

  return { value, onChange };
}
