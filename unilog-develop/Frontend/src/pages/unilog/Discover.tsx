import React, { useState, useEffect } from 'react';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiFieldSearch,
  EuiLoadingSpinner,
  EuiDataGridColumn
} from '@elastic/eui';
import { Moment } from 'moment';

import {
  useTimeRangePicker,
  TimeRangePicker
} from 'components/TimeRangePicker';
import {
  SingleItemTimeBarChart,
  DataSchema as TimeBarDataSchema
} from 'components/SingleItemTimeBarChart';
import DataTable from 'components/DataTable';
import {
  DiscoverParams,
  loadDiscoverHitsByTime,
  loadDiscoverTableDataList
} from 'utils/api/kibana';

export function Discover() {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  } = useTimeRangePicker();
  const {
    deviceName,
    onChangeDeviceName,
    keyword,
    onChangeKeyword
  } = useSearchParams();

  return (
    <EuiPage className="euiNavDrawerPage">
      <EuiPageBody className="euiNavDrawerPage__pageBody">
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <h1>Discover</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentBody>
            <EuiFlexGroup>
              <EuiFlexItem grow={false}>
                <EuiFormRow label="時間起迄">
                  <TimeRangePicker
                    startTime={startTime}
                    onChangeStart={onChangeStart}
                    endTime={endTime}
                    onChangeEnd={onChangeEnd}
                    onListItemClick={onListItemClick}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiFormRow label="裝置名稱">
                  <EuiFieldSearch
                    name="deviceName"
                    value={deviceName}
                    onChange={onChangeDeviceName}
                    isClearable
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiFormRow label="搜尋字串">
                  <EuiFieldSearch
                    name="keyword"
                    value={keyword}
                    onChange={onChangeKeyword}
                    isClearable
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="xl" />
            <KibanaArea
              startTime={startTime}
              endTime={endTime}
              deviceName={deviceName}
              keyword={keyword}
            />
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
export default Discover;

interface onChangeHandler {
  (event: React.FormEvent<HTMLInputElement>): void;
}

function useSearchParams() {
  const [deviceName, setDeviceName] = useState<string>('protal_log-*');
  const [keyword, setKeyword] = useState<string>('');
  const onChangeDeviceName: onChangeHandler = event => {
    const inputString = event.currentTarget.value;
    if (inputString !== deviceName) {
      setDeviceName(inputString);
    }
  };
  const onChangeKeyword: onChangeHandler = event => {
    const inputString = event.currentTarget.value;
    if (inputString !== keyword) {
      setKeyword(inputString);
    }
  };

  return {
    deviceName,
    onChangeDeviceName,
    keyword,
    onChangeKeyword
  };
}

interface TableRowSchema {
  time: string;
  _source: string;
}
const columns: EuiDataGridColumn[] = [
  {
    id: 'time',
    display: 'Time',
    initialWidth: 180,
    defaultSortDirection: 'desc',
    actions: {
      showSortAsc: true,
      showSortDesc: true,
      showMoveLeft: false,
      showMoveRight: false,
      showHide: false
    }
  },
  {
    id: '_source',
    display: '_source',
    actions: false,
    schema: 'json'
  }
];
interface KibanaAreaPropsSchema {
  startTime: Moment;
  endTime: Moment;
  deviceName: string;
  keyword: string;
}
function KibanaArea(props: KibanaAreaPropsSchema) {
  const params: DiscoverParams = {
    startTime: props.startTime.format(),
    endTime: props.endTime.format(),
    deviceName: props.deviceName,
    keyword: props.keyword || '*'
  };
  const { isLoading, hitsByTime, tableDataList } = useKibanaData(params);

  if (!props.deviceName) return <>請輸入裝置名稱！</>;
  if (isLoading) return <EuiLoadingSpinner size="xl" />;

  return (
    <>
      <SingleItemTimeBarChart
        itemName="Count"
        height={150}
        timeFormat="MM/DD HH:mm"
        data={hitsByTime}
      />
      <DataTable<TableRowSchema>
        columns={columns}
        rows={tableDataList}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 30, 50]
        }}
      />
    </>
  );
}

function useKibanaData(params: DiscoverParams) {
  const { isLoading: isLoading1, hitsByTime } = useHitsByTime(params);

  const { isLoading: isLoading2, tableDataList } = useTableDataList(params);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(isLoading1 || isLoading2);
  }, [isLoading1, isLoading2]);

  return {
    isLoading,
    hitsByTime,
    tableDataList
  };
}

function useHitsByTime(params: DiscoverParams) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hitsByTime, setHitsByTime] = useState<TimeBarDataSchema[]>([]);
  useEffect(() => {
    if (params.deviceName) {
      setIsLoading(true);
      loadDiscoverHitsByTime(params).then(hitsByTime => {
        setHitsByTime(hitsByTime);
        setIsLoading(false);
      });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, Object.values(params));
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    isLoading,
    hitsByTime
  };
}

function useTableDataList(params: DiscoverParams) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableDataList, setTableDataList] = useState<TableRowSchema[]>([]);
  useEffect(() => {
    if (params.deviceName) {
      setIsLoading(true);
      loadDiscoverTableDataList(params).then(tableDataList => {
        setTableDataList(tableDataList);
        setIsLoading(false);
      });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, Object.values(params));
  /* eslint-enable react-hooks/exhaustive-deps */

  return {
    isLoading,
    tableDataList
  };
}
