import { EuiSelectOption } from '@elastic/eui';
import { ChangeEventHandler, useEffect, useState } from 'react';

export type OptionValue = string | number | undefined;

export function useEuiSelect(options: EuiSelectOption[]) {
  const [value, setValue] = useState<OptionValue>('');

  const onChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const { value } = e.target;
    setValue(value);
  };

  useEffect(() => {
    setValue(getFirstOption(options));
  }, [options]);

  return { options, value, onChange };
}

export function optionValueToString(value: OptionValue) {
  if (!value) return '';
  if (typeof value === 'number') return value.toString();
  return value;
}

function getFirstOption(options: EuiSelectOption[]) {
  if (options.length === 0) {
    return '';
  } else if (Array.isArray(options[0].value)) {
    return options[0].value[0] ?? '';
  } else {
    return options[0].value;
  }
}
