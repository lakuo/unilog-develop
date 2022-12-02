import { EuiComboBoxOptionOption } from '@elastic/eui';
import { useState } from 'react';

export type OptionValue = string | number | undefined;

export function useEuiComboBox(options: EuiComboBoxOptionOption<string>[]) {
  const [selectedOptions, setSelectedOptions] = useState<
    EuiComboBoxOptionOption<string>[]
  >([]);

  const onChange = (selected: EuiComboBoxOptionOption<string>[]) => {
    setSelectedOptions(selected);
  };

  return { options, selectedOptions, onChange };
}
