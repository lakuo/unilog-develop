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
  loadPortalLoginsTotal,
  loadPortalLoginsByTime,
  loadPortalLoginsByIp,
  loadPortalLoginsByUser
} from 'utils/api/kibana';

export default function PortalStatistics1() {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  } = useTimeRangePicker();

  return (
    <DashboardLayout
      title="入口網登入次數統計"
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
    display: '入口網IP登入次數',
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
const byUserColumns: EuiDataGridColumn[] = [
  {
    id: 'name',
    display: '入口網使用者登入次數',
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
    loginsByTime,
    totalLogins,
    loginsByIp,
    loginsByUser
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
                title={totalLogins}
                description="入口網登入次數"
                textAlign="center"
                reverse
              />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <SingleItemTimeBarChart
                itemName="入口網登入次數"
                height={130}
                timeFormat="MM/DD HH:mm"
                data={loginsByTime}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <DonutChart data={loginsByIp} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byIpColumns}
                rows={loginsByIp}
                pagination={{
                  pageSize: 6,
                  pageSizeOptions: [6]
                }}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <DonutChart data={loginsByUser} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byUserColumns}
                rows={loginsByUser}
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
  const { isLoading: isLoading1, totalLogins } = useTotalLogins(
    startTime,
    endTime
  );

  const { isLoading: isLoading2, loginsByTime } = useLoginsByTime(
    startTime,
    endTime
  );

  const { isLoading: isLoading3, loginsByIp } = useLoginsByIp(
    startTime,
    endTime
  );

  const { isLoading: isLoading4, loginsByUser } = useLoginsByUser(
    startTime,
    endTime
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(isLoading1 || isLoading2 || isLoading3 || isLoading4);
  }, [isLoading1, isLoading2, isLoading3, isLoading4]);

  return {
    isLoading,
    totalLogins,
    loginsByTime,
    loginsByIp,
    loginsByUser
  };
}

function useTotalLogins(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalLogins, setTotalLogins] = useState<number>(0);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginsTotal(startTime, endTime).then(total => {
      setTotalLogins(total);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    totalLogins
  };
}

function useLoginsByTime(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginsByTime, setLoginsByTime] = useState<TimeBarDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginsByTime(startTime, endTime).then(dataList => {
      setLoginsByTime(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginsByTime
  };
}

function useLoginsByIp(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginsByIp, setLoginsByIp] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginsByIp(startTime, endTime).then(dataList => {
      setLoginsByIp(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginsByIp
  };
}

function useLoginsByUser(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginsByUser, setLoginsByUser] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginsByUser(startTime, endTime).then(dataList => {
      setLoginsByUser(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginsByUser
  };
}
