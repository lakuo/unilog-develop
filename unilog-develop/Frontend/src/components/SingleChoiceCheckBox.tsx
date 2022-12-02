import { EuiCheckbox } from '@elastic/eui';
import React, { ChangeEventHandler } from 'react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  id: string;
  checkedId: string;
  setCheckedId: Dispatch<SetStateAction<string>>;
  label?: string;
  disabled?: boolean;
}
export function SingleChoiceCheckBox(props: Props) {
  const { id, checkedId, setCheckedId, label, disabled } = props;

  const onChange: ChangeEventHandler<HTMLInputElement> = e => {
    const { checked } = e.target;
    setCheckedId(checked ? id : '');
  };

  return (
    <EuiCheckbox
      id={id}
      label={label}
      checked={id === checkedId}
      disabled={disabled}
      onChange={onChange}
    />
  );
}
