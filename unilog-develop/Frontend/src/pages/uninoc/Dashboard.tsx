import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer
} from '@elastic/eui';

import { Moment } from 'moment';
import { OptionValue, optionValueToString } from 'hooks/useEuiSelect';
import {
  getNocApiKey,
  getNocHostGroups,
  getNocAllHosts,
  getNocHostItem,
  getNocItemTimeline
} from 'utils/api/uninoc';
import { UniNocHost, UniNocHostGroup } from 'utils/api/uninoc/model';
import { useNocTimeRange } from 'hooks/useNocTimeRange';
import PageLayout from 'layouts/PageLayout';
import ControlArea, {
  useHostGroup,
  useHostName,
  useRefreshRate
} from 'components/Entry/NOC/ControlArea';
import NocChart, { NocChartData } from 'components/Entry/NOC/NocChart';

export default function NOC() {
  const { update, timeRange } = useNocTimeRange();
  const hostGroups = useNocHostGroups();
  const hostGroup = useHostGroup(hostGroups);
  const hostNames = useNocHosts(hostGroup.value);
  const hostName = useHostName(hostNames);
  const refreshRate = useRefreshRate();
  const { download, upload, cpu, memory, storage } = useNocDataSet(
    String(hostName.value),
    timeRange.startTime,
    timeRange.endTime
  );
  useNocUpdater(update, refreshRate.value);

  const start = timeRange.startTime.valueOf();
  const end = timeRange.endTime.valueOf();

  return (
    <PageLayout title="UniNOC">
      <EuiPageContent>
        <EuiPageContentBody>
          <ControlArea {...{ timeRange, hostGroup, hostName, refreshRate }} />
          <EuiFlexGroup>
            <EuiFlexItem>
              <NocChart
                title="網路下載速度"
                data={download}
                fixed={0}
                domainX={{ min: start, max: end }}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <NocChart
                title="網路上傳速度"
                data={upload}
                fixed={0}
                domainX={{ min: start, max: end }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiSpacer size="l" />
          <NocChart
            title="CPU使用率"
            data={cpu}
            unit="%"
            fixed={2}
            domainX={{ min: start, max: end }}
            domainY={{ min: 0, max: 100 }}
          />
          <EuiSpacer size="l" />
          <NocChart
            title="記憶體使用率"
            data={memory}
            unit="%"
            fixed={2}
            domainX={{ min: start, max: end }}
            domainY={{ min: 0, max: 100 }}
          />
          <EuiSpacer size="l" />
          <NocChart
            title="磁碟使用率"
            data={storage}
            unit="%"
            fixed={2}
            domainX={{ min: start, max: end }}
            domainY={{ min: 0, max: 100 }}
          />
        </EuiPageContentBody>
      </EuiPageContent>
    </PageLayout>
  );
}

/* 更新器 */
function useNocUpdater(
  update: (() => void) | undefined,
  refreshRate: OptionValue
) {
  const updater = useRef(-1);

  useEffect(() => {
    clearInterval(updater.current);
    if (!update) return;
    update();
    if (Number(refreshRate) <= 0) return;
    updater.current = setInterval(update, Number(refreshRate) * 1000);
  }, [refreshRate, update]);
}

/* 主機群組 */
function useNocHostGroups() {
  const [groups, setGroups] = useState<UniNocHostGroup[]>([]);

  useEffect(() => {
    (async () => {
      await getNocApiKey('Admin', 'zabbix');
      const res_1 = await getNocHostGroups();
      setGroups(res_1.data.result);
    })();
  }, []);

  return groups;
}

/* 主機列表 */
function useNocHosts(group: OptionValue) {
  const [hosts, setHosts] = useState<UniNocHost[]>([]);

  useEffect(() => {
    (async () => {
      if (!group) return;
      const id = optionValueToString(group);
      const res = await getNocAllHosts([id]);
      setHosts(res.data.result);
    })();
  }, [group]);

  return hosts;
}

/* Noc資料集合 */
function useNocDataSet(hostName: string, start: Moment, end: Moment) {
  const props = useMemo<[string, number, number]>(
    () => [
      hostName,
      Math.floor(start.valueOf() / 1000),
      Math.floor(end.valueOf() / 1000)
    ],
    [end, hostName, start]
  );

  const upload = useNocData('Bits sent', true, ...props);
  const download = useNocData('Bits received', true, ...props);
  const memory = useNocData('Memory utilization', false, ...props);
  const cpu = useNocData('CPU utilization', false, ...props);
  const storage = useNocData('Storage utilization', false, ...props);

  return { upload, download, memory, cpu, storage };
}

/* Noc資料 */
function useNocData(
  itemName: string,
  isNetwork: boolean,
  hostName: string,
  start: number,
  end: number
) {
  const [data, setData] = useState<NocChartData[]>([]);

  const update = useCallback(async () => {
    if (!hostName) return;
    const res_1 = await getNocHostItem(hostName, itemName ?? '');
    const items = res_1.data.result;
    const itemids = items.map(item => item.itemid);
    const res_2 = await Promise.all(
      itemids.map(id => getNocItemTimeline([id], isNetwork, start, end))
    );
    setData(
      res_2.map((res, i) => ({
        name: items[i].name,
        items: res.data.result.map(item => ({
          clock: Number(item.clock),
          value: item.value
        }))
      }))
    );
  }, [end, hostName, isNetwork, itemName, start]);

  useEffect(() => {
    update();
  }, [update]);

  return data;
}
