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
  loadTotalBlocks,
  loadBlocksByTime,
  loadBlocksBySrc,
  loadBlocksByDst
} from 'utils/api/kibana';

export default function Dashboard2() {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  } = useTimeRangePicker();

  return (
    <DashboardLayout
      title="受攻擊次數統計及圖表"
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

const bySrcColumns: EuiDataGridColumn[] = [
  {
    id: 'name',
    display: '攻擊來源IP',
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
const byDstColumns: EuiDataGridColumn[] = [
  {
    id: 'name',
    display: '攻擊目的IP',
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
    blocksByTime,
    totalBlocks,
    blocksBySrc,
    blocksByDst
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
                title={totalBlocks}
                description="阻擋"
                textAlign="center"
                reverse
              />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <SingleItemTimeBarChart
                itemName="阻擋"
                height={130}
                timeFormat="MM/DD HH:mm"
                data={blocksByTime}
              />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiPanel paddingSize="s" hasShadow>
              <EuiSpacer size="xl" />
              <DonutChart data={blocksBySrc} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={bySrcColumns}
                rows={blocksBySrc}
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
              <DonutChart data={blocksByDst} width={400} height={200} />
              <EuiSpacer size="xl" />
            </EuiPanel>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiPanel paddingSize="s" hasShadow>
              <DataTable<DonutDataSchema>
                columns={byDstColumns}
                rows={blocksByDst}
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
  const { isLoading: isLoading1, totalBlocks } = useTotalBlocks(
    startTime,
    endTime
  );

  const { isLoading: isLoading2, blocksByTime } = useBlocksByTime(
    startTime,
    endTime
  );

  const { isLoading: isLoading3, blocksBySrc } = useBlocksBySrc(
    startTime,
    endTime
  );

  const { isLoading: isLoading4, blocksByDst } = useBlocksByDst(
    startTime,
    endTime
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(isLoading1 || isLoading2 || isLoading3 || isLoading4);
  }, [isLoading1, isLoading2, isLoading3, isLoading4]);

  return {
    isLoading,
    totalBlocks,
    blocksByTime,
    blocksBySrc,
    blocksByDst
  };
}

function useTotalBlocks(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalBlocks, setTotalBlocks] = useState<number>(0);
  useEffect(() => {
    setIsLoading(true);
    loadTotalBlocks(startTime, endTime).then(total => {
      setTotalBlocks(total);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    totalBlocks
  };
}

function useBlocksByTime(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blocksByTime, setBlocksByTime] = useState<TimeBarDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadBlocksByTime(startTime, endTime).then(blocksByTime => {
      setBlocksByTime(blocksByTime);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    blocksByTime
  };
}

function useBlocksBySrc(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blocksBySrc, setBlocksBySrc] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadBlocksBySrc(startTime, endTime).then(blocksBySrc => {
      setBlocksBySrc(blocksBySrc);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    blocksBySrc
  };
}

function useBlocksByDst(startTime: string, endTime: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blocksByDst, setBlocksByDst] = useState<DonutDataSchema[]>([]);
  useEffect(() => {
    setIsLoading(true);
    loadBlocksByDst(startTime, endTime).then(blocksByDst => {
      setBlocksByDst(blocksByDst);
      setIsLoading(false);
    });
  }, [startTime, endTime]);

  return {
    isLoading,
    blocksByDst
  };
}
