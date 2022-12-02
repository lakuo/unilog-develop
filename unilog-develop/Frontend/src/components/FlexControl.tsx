import { EuiFlexGroup, EuiFlexItem, EuiFormRow } from '@elastic/eui';
import React, { CSSProperties } from 'react';
import { FlexGrow } from 'utils/types';

interface Props {
  controls: FlexControlSetting[];
}
export default function FlexControl(props: Props) {
  const { controls } = props;

  return (
    <EuiFlexGroup>
      {controls.map(ctrl => (
        <EuiFlexItem
          grow={ctrl.grow as FlexGrow}
          key={ctrl.label}
          style={{ maxWidth: '400px', ...ctrl.style }}
        >
          <EuiFormRow label={ctrl.label} key={ctrl.label}>
            {ctrl.render()}
          </EuiFormRow>
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
}

export interface FlexControlSetting {
  label: string;
  grow: FlexGrow;
  style?: CSSProperties;
  render: (...value: any) => JSX.Element;
}
