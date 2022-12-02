import React, { useEffect, useState } from 'react';
import {
  EuiLoadingSpinner,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiStat,
  EuiDataGridColumn
} from '@elastic/eui';
import { Moment } from 'moment';

import { DashboardLayout } from 'layouts/DashboardLayout';
import { useTimeRangePicker } from 'components/TimeRangePicker';
import {
  SingleItemTimeBarChart,
  DataSchema as TimeBarDataSchema
} from 'components/SingleItemTimeBarChart';
import {
  DonutChart,
  DataSchema as DonutDataSchema
} from 'components/DonutChart';
import DataTable from 'components/DataTable';
import {
  loadPortalLoginBlocksTotal,
  loadPortalLoginBlocksByTime,
  loadPortalLoginBlocksByIp
} from 'utils/api/kibana';

export default function PortalStatistics2() {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  } = useTimeRangePicker();

  return (
    <DashboardLayout
      title="入口網登入阻擋次數統計"
      startTime={startTime}
      onChangeStart={onChangeStart}
      endTime={endTime}
      onChangeEnd={onChangeEnd}
      onListItemClick={onListItemClick}
    >
      <KibanaArea startTime={startTime} endTime={endTime} />
    </DashboardLayout>
  );
}

const byIpColumns: EuiDataGridColumn[] = [
  {
    id: 'name',
    display: '入口網登入阻擋次數',
    actions: false
  },
  {
    id: 'value',
    display: 'Count',
    schema: 'numeric',
    initialWidth: 80,
    defaultSortDirection: 'desc',
    actions: {
      showSortAsc: true,
      showSortDesc: true,
      showMoveLeft: false,
      showMoveRight: false,
      showHide: false
    }
  }
];
interface KibanaAreaPropsSchema {
  startTime: Moment;
  endTime: Moment;
}
function KibanaArea(props: KibanaAreaPropsSchema) {
  const {
    isLoading,
    loginBlocksByTime,
    totalLoginBlocks,
    loginBlocksByIp
  } = useKibanaData(props.startTime.format(), props.endTime.format());

  if (isLoading) {
    return <EuiLoadingSpinner size="xl" />;
  } else {
    return (
      <>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel style={{ width: '11rem' }} paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <EuiStat
                title={totalLoginBlocks}
                description="入口網登入阻擋次數"
                textAlign="center"
                reverse
              />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <SingleItemTimeBarChart
                itemName="入口網登入阻擋次數"
                height={130}
                timeFormat="MM/DD HH:mm"
                data={loginBlocksByTime}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <DonutChart data={loginBlocksByIp} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byIpColumns}
                rows={loginBlocksByIp}
                pagination={{
                  pageSize: 6,
                  pageSizeOptions: [6]
                }}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    );
  }
}

function useKibanaData(startTime: string, endTime: string) {
  const { isLoading: isLoading1, totalLoginBlocks } = useTotalLoginBlocks(
    startTime,
    endTime
  );

  const { isLoading: isLoading2, loginBlocksByTime } = useLoginBlocksByTime(
    startTime,
    endTime
  );

  const { isLoading: isLoading3, loginBlocksByIp } = useLoginBlocksByIp(
    startTime,
    endTime
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(isLoading1 || isLoading2 || isLoading3);
  }, [isLoading1, isLoading2, isLoading3]);

  return {
    isLoading,
    totalLoginBlocks,
    loginBlocksByTime,
    loginBlocksByIp
  };
}

function useTotalLoginBlocks(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalLoginBlocks, setTotalLoginBlocks] = useState<number>(0);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginBlocksTotal(startTime, endTime).then(total => {
      setTotalLoginBlocks(total);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    totalLoginBlocks
  };
}

function useLoginBlocksByTime(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginBlocksByTime, setLoginBlocksByTime] = useState<
    TimeBarDataSchema[]
  >([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginBlocksByTime(startTime, endTime).then(dataList => {
      setLoginBlocksByTime(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginBlocksByTime
  };
}

function useLoginBlocksByIp(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginBlocksByIp, setLoginBlocksByIp] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginBlocksByIp(startTime, endTime).then(dataList => {
      setLoginBlocksByIp(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginBlocksByIp
  };
}
