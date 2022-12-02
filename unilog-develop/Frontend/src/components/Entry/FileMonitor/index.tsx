import React, { useEffect, useMemo, useState } from 'react';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiSpacer,
  EuiSelectOption,
  EuiSelect
} from '@elastic/eui';

import TimeRangePicker, {
  useTimeRangePicker
} from 'components/TimeRangePicker';
import FileMonitorTable from './FileMonitorTable';
import { FlexGrow } from 'utils/types';
import { useEuiSelect } from 'hooks/useEuiSelect';
import FlexControl from 'components/FlexControl';
import { getGroupList, getWatchIpList } from 'utils/api/uniwatch';

export default function FileMonitor() {
  const controls = useFlexControl();

  return (
    <EuiPageContent>
      <EuiPageContentBody>
        <EuiFlexGroup>
          <FlexControl controls={controls.props} />
        </EuiFlexGroup>
        <EuiSpacer size="l" />
        <FileMonitorTable {...controls.value} />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

/** 搜尋條件 */
function useFlexControl() {
  const timeRange = useTimeRange();
  const hostGroup = useHostGroup();
  const [ipList, setIpList] = useState<EuiComboBoxOptionOption<string>[]>([]);
  const hostIp = useHostIp(ipList);
  const encryption = useEncryption();

  useEffect(() => {
    if (!hostGroup.value) {
      setIpList([]);
    } else {
      getWatchIpList(String(hostGroup.value)).then(res =>
        setIpList(res.group_ip.split(',').map(ip => ({ label: ip })))
      );
    }
  }, [hostGroup.value]);

  return {
    value: {
      timeRange: timeRange.value,
      hostGroup: hostGroup.value,
      ipList,
      hostIp: hostIp.value,
      encryption: encryption.value
    },
    props: [timeRange.props, hostGroup.props, hostIp.props, encryption.props]
  };
}

/** 時間區間 */
function useTimeRange() {
  const timeRange = useTimeRangePicker();

  const value = useMemo(() => [timeRange.startTime, timeRange.endTime], [
    timeRange.endTime,
    timeRange.startTime
  ]);

  return {
    value,
    props: {
      label: '時間區間',
      grow: 1 as FlexGrow,
      render: () => (
        <TimeRangePicker {...timeRange} style={{ minWidth: '260px' }} />
      )
    }
  };
}

function useHostGroup() {
  const [options, setOptions] = useState<EuiSelectOption[]>([]);
  const select = useEuiSelect(options);

  useEffect(() => {
    getGroupList().then(res => {
      setOptions([
        { text: '', value: '' },
        ...res.map(group => ({ text: group.group_name, value: group.group_id }))
      ]);
    });
  }, []);

  return {
    value: select.value,
    props: {
      label: '主機群組',
      grow: 1 as FlexGrow,
      render: () => <EuiSelect {...select} />
    }
  };
}

/** 主機名稱 */
function useHostIp(options: EuiComboBoxOptionOption<string>[]) {
  const [selectedOptions, setSelectedOptions] = useState<
    EuiComboBoxOptionOption<string>[]
  >([]);

  const onChange = (options: EuiComboBoxOptionOption<string>[]) => {
    setSelectedOptions(options);
  };

  useEffect(() => {
    setSelectedOptions([]);
  }, [options]);

  return {
    value: selectedOptions.map(option => option.label),
    props: {
      label: '主機IP',
      grow: 1 as FlexGrow,
      render: () => <EuiComboBox {...{ options, selectedOptions, onChange }} />
    }
  };
}

/** 加密方式 */
function useEncryption() {
  const [selectedOptions, setSelectedOptions] = useState<
    EuiComboBoxOptionOption<string>[]
  >([]);

  const options: EuiComboBoxOptionOption<string>[] = [
    { label: 'md5' },
    { label: 'sha1' },
    { label: 'sha256' },
    { label: 'sha512' },
    { label: 'crc32' }
  ];

  const onChange = (options: EuiComboBoxOptionOption<string>[]) => {
    setSelectedOptions(options);
  };

  return {
    value: selectedOptions.map(option => option.label),
    props: {
      label: '加密方式',
      grow: 1 as FlexGrow,
      render: () => <EuiComboBox {...{ options, selectedOptions, onChange }} />
    }
  };
}
