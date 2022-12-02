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
  loadPortalLoginSuccessesTotal,
  loadPortalLoginSuccessesByTime,
  loadPortalLoginSuccessesByIp,
  loadPortalLoginSuccessesByUser
} from 'utils/api/kibana';

export default function PortalStatistics3() {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  } = useTimeRangePicker();

  return (
    <DashboardLayout
      title="入口網使用者成功登入次數"
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
    display: '入口網IP成功登入次數',
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
    display: '入口網使用者成功登入次數',
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
    loginSuccessesByTime,
    totalLoginSuccesses,
    loginSuccessesByIp,
    loginSuccessesByUser
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
                title={totalLoginSuccesses}
                description="入口網成功登入次數"
                textAlign="center"
                reverse
              />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <SingleItemTimeBarChart
                itemName="入口網成功登入次數"
                height={130}
                timeFormat="MM/DD HH:mm"
                data={loginSuccessesByTime}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <DonutChart data={loginSuccessesByIp} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byIpColumns}
                rows={loginSuccessesByIp}
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
              <DonutChart
                data={loginSuccessesByUser}
                width={400}
                height={200}
              />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byUserColumns}
                rows={loginSuccessesByUser}
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
  const { isLoading: isLoading1, totalLoginSuccesses } = useTotalLoginSuccesses(
    startTime,
    endTime
  );

  const {
    isLoading: isLoading2,
    loginSuccessesByTime
  } = useLoginSuccessesByTime(startTime, endTime);

  const { isLoading: isLoading3, loginSuccessesByIp } = useLoginSuccessesByIp(
    startTime,
    endTime
  );

  const {
    isLoading: isLoading4,
    loginSuccessesByUser
  } = useLoginSuccessesByUser(startTime, endTime);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(isLoading1 || isLoading2 || isLoading3 || isLoading4);
  }, [isLoading1, isLoading2, isLoading3, isLoading4]);

  return {
    isLoading,
    totalLoginSuccesses,
    loginSuccessesByTime,
    loginSuccessesByIp,
    loginSuccessesByUser
  };
}

function useTotalLoginSuccesses(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalLoginSuccesses, setTotalLoginSuccesses] = useState<number>(0);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginSuccessesTotal(startTime, endTime).then(total => {
      setTotalLoginSuccesses(total);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    totalLoginSuccesses
  };
}

function useLoginSuccessesByTime(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginSuccessesByTime, setLoginSuccessesByTime] = useState<
    TimeBarDataSchema[]
  >([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginSuccessesByTime(startTime, endTime).then(dataList => {
      setLoginSuccessesByTime(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginSuccessesByTime
  };
}

function useLoginSuccessesByIp(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginSuccessesByIp, setLoginSuccessesByIp] = useState<
    DonutDataSchema[]
  >([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginSuccessesByIp(startTime, endTime).then(dataList => {
      setLoginSuccessesByIp(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginSuccessesByIp
  };
}

function useLoginSuccessesByUser(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loginSuccessesByUser, setLoginSuccessesByUser] = useState<
    DonutDataSchema[]
  >([]);
  useEffect(() => {
    setIsLoading(true);
    loadPortalLoginSuccessesByUser(startTime, endTime).then(dataList => {
      setLoginSuccessesByUser(dataList);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    loginSuccessesByUser
  };
}
