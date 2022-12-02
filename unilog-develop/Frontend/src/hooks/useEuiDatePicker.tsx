import moment, { Moment } from 'moment';
import { useState } from 'react';

export function useEuiDatePicker() {
  const [selected, setSelected] = useState(moment());

  const onChange = (date: Moment) => {
    setSelected(date);
  };

  return { selected, onChange };
}
