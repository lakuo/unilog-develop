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
  loadOutTotalLinks,
  loadOutLinksByTime,
  loadOutLinksByService,
  loadOutLinksByIp
} from 'utils/api/kibana';

export default function Dashboard1() {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  } = useTimeRangePicker();

  return (
    <DashboardLayout
      title="fortigate:對外連線"
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

const byServiceColumns: EuiDataGridColumn[] = [
  {
    id: 'name',
    display: '對外連線服務',
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

const byIpColumns: EuiDataGridColumn[] = [
  {
    id: 'name',
    display: '對外連線目的IP',
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
    linksByTime,
    totalLinks,
    linksByService,
    linksByIp
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
                title={totalLinks}
                description="對外連線"
                textAlign="center"
                reverse
              />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <SingleItemTimeBarChart
                itemName="連外流量"
                height={130}
                timeFormat="MM/DD HH:mm"
                data={linksByTime}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <DonutChart data={linksByService} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byServiceColumns}
                rows={linksByService}
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
              <DonutChart data={linksByIp} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byIpColumns}
                rows={linksByIp}
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
  const { isLoading: isLoading1, totalLinks } = useTotalLinks(
    startTime,
    endTime
  );

  const { isLoading: isLoading2, linksByTime } = useLinksByTime(
    startTime,
    endTime
  );

  const { isLoading: isLoading3, linksByService } = useLinksByService(
    startTime,
    endTime
  );

  const { isLoading: isLoading4, linksByIp } = useLinksByIp(startTime, endTime);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(isLoading1 || isLoading2 || isLoading3 || isLoading4);
  }, [isLoading1, isLoading2, isLoading3, isLoading4]);

  return {
    isLoading,
    totalLinks,
    linksByTime,
    linksByService,
    linksByIp
  };
}

function useTotalLinks(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalLinks, setTotalLinks] = useState<number>(0);
  useEffect(() => {
    setIsLoading(true);
    loadOutTotalLinks(startTime, endTime).then(total => {
      setTotalLinks(total);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    totalLinks
  };
}

function useLinksByTime(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [linksByTime, setLinksByTime] = useState<TimeBarDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadOutLinksByTime(startTime, endTime).then(linksByTime => {
      setLinksByTime(linksByTime);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    linksByTime
  };
}

function useLinksByService(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [linksByService, setLinksByService] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadOutLinksByService(startTime, endTime).then(linksByService => {
      setLinksByService(linksByService);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    linksByService
  };
}

function useLinksByIp(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [linksByIp, setLinksByIp] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadOutLinksByIp(startTime, endTime).then(linksByIp => {
      setLinksByIp(linksByIp);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    linksByIp
  };
}
