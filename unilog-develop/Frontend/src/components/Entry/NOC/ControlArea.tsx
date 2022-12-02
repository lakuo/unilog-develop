import {
  EuiCheckboxGroupOption,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSelect,
  EuiSelectOption
} from '@elastic/eui';
import TimeRangePicker, {
  useTimeRangePicker
} from 'components/TimeRangePicker';
import { useEuiSelect } from 'hooks/useEuiSelect';
import React, { useMemo, useState } from 'react';
import { UniNocHostGroup, UniNocHost } from 'utils/api/uninoc/model';
import { FlexGrow } from 'utils/types';

interface Props {
  timeRange: ReturnType<typeof useTimeRangePicker>;
  hostGroup: ReturnType<typeof useEuiSelect>;
  hostName: ReturnType<typeof useEuiSelect>;
  refreshRate: ReturnType<typeof useEuiSelect>;
}
export default function ControlArea(props: Props) {
  const { timeRange, hostGroup, hostName, refreshRate } = props;

  const items = [
    {
      label: '時間區間',
      grow: 2,
      node: <TimeRangePicker {...timeRange} style={{ minWidth: '260px' }} />
    },
    {
      label: '主機群組',
      grow: 1,
      node: <EuiSelect {...hostGroup} style={{ minWidth: '100px' }} />
    },
    {
      label: '主機名稱',
      grow: 1,
      node: <EuiSelect {...hostName} style={{ minWidth: '100px' }} />
    },
    {
      label: '更新頻率',
      grow: 1,
      node: <EuiSelect {...refreshRate} style={{ minWidth: '100px' }} />
    }
  ];

  return (
    <EuiFlexGroup>
      {items.map(item => (
        <EuiFlexItem
          grow={item.grow as FlexGrow}
          key={item.label}
          style={{ maxWidth: '400px' }}
        >
          <EuiFormRow label={item.label}>{item.node}</EuiFormRow>
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
}

/* 主機群組 */
export function useHostGroup(groups: UniNocHostGroup[]) {
  const options = useMemo<EuiSelectOption[]>(
    () =>
      groups.map(group => ({
        value: group.groupid,
        text: group.name
      })),
    [groups]
  );
  const select = useEuiSelect(options);

  return select;
}

/* 主機名稱 */
export function useHostName(hosts: UniNocHost[]) {
  const options = useMemo<EuiSelectOption[]>(
    () =>
      hosts.map(host => ({
        value: host.host,
        text: host.host
      })),
    [hosts]
  );
  const select = useEuiSelect(options);

  return select;
}

/* 篩選條件 */
export function useFilter() {
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({
    min: true,
    max: true,
    avg: true,
    current: true
  });

  const options: EuiCheckboxGroupOption[] = [
    { id: 'min', label: 'min' },
    { id: 'max', label: 'max' },
    { id: 'avg', label: 'avg' },
    { id: 'current', label: 'current' }
  ];

  const onChange = (id: string) => {
    const key = id;
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return { selected, options, onChange };
}

/* 更新頻率 */
export function useRefreshRate() {
  return useEuiSelect(refreshRateArray);
}

const refreshRateArray = [
  { value: '0', text: 'off' },
  { value: '10', text: '10s' },
  { value: '30', text: '30s' },
  { value: '60', text: '1m' },
  { value: '300', text: '5m' }
];
