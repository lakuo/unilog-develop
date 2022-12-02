import React, { ChangeEvent, useState } from 'react';
import {
  EuiButton,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiSpacer
} from '@elastic/eui';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { SubAccessType } from 'utils/accessLevel';

interface Props {
  loading: boolean;
  inputValue: string;
  onInputChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  onAddButtonClick: () => void;
}

export default function ControlBar(props: Props) {
  const { loading, inputValue, onInputChange, onAddButtonClick } = props;
  const { getAccessLevel } = useGlobalState();

  const isWrite = getAccessLevel(SubAccessType.User).write;

  return (
    <>
      <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
        <div style={{ display: 'flex' }}>
          <EuiFieldSearch
            value={inputValue}
            onChange={onInputChange}
            placeholder="搜尋"
            compressed
            isClearable
            disabled={loading}
            style={{ width: '230px' }}
          />
          {isWrite && (
            <EuiButton
              iconType="plusInCircle"
              size="s"
              disabled={loading}
              style={{ marginLeft: '10px' }}
              onClick={onAddButtonClick}
            >
              新增
            </EuiButton>
          )}
        </div>
      </EuiFlexGroup>
      <EuiSpacer size="m" />
    </>
  );
}

export function useSearchInput() {
  const [value, setValue] = useState('');

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setValue(value);
  };

  return { value, onChange };
}
