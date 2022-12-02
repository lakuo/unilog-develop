import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import ContentLayout from 'layouts/ContentLayout';
import {
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFormRow,
  EuiSelect,
  EuiSelectOption,
  EuiSpacer
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import DeleteModal from 'components/MonitorChecklist/DeleteModal';
import EditModal from 'components/MonitorChecklist/EditModal';
import {
  deleteWatchData,
  getGroupList,
  getWatchData
} from 'utils/api/uniwatch';
import { UniWatchItem } from 'utils/api/uniwatch/model';
import { CustomTableOptions, useCustomTable } from 'hooks/useCustomTable';
import CustomTable, { LoadingState } from 'components/CustomTable';
import { RoutePath } from 'utils/enums';
import { useEuiSelect } from 'hooks/useEuiSelect';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { SubAccessType } from 'utils/accessLevel';

type State = 'none' | 'add' | 'delete';
interface DelInfo {
  pid: string;
  ip: string;
}

export default function WatchList() {
  const { getAccessLevel } = useGlobalState();
  const [state, setState] = useState<State>('none');
  const [delInfo, setDelInfo] = useState<DelInfo>({ pid: '', ip: '' });
  const { hostGroup } = useFilters();
  const { tableProps, update } = useWatchTable(
    String(hostGroup.value ?? ''),
    setState,
    setDelInfo,
    getAccessLevel(SubAccessType.UniWatch).write
  );
  const {
    onListBtnClick,
    onCreateBtnClick,
    handleModalClose
  } = useWatchActions(setState, setDelInfo);

  return (
    <>
      <ContentLayout title="檔案監控清單">
        <EuiFormRow label="主機群組">
          <EuiSelect {...hostGroup} />
        </EuiFormRow>
        <EuiSpacer size="l" />
        <CustomTable {...tableProps} />
        <EuiSpacer size="l" />
        <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
          {getAccessLevel(SubAccessType.HostGroup).read && (
            <EuiButton onClick={onListBtnClick}>群組清單</EuiButton>
          )}
          {getAccessLevel(SubAccessType.UniWatch).write && (
            <>
              <div style={{ width: '16px' }} />
              <EuiButton onClick={onCreateBtnClick}>新增</EuiButton>
            </>
          )}
        </EuiFlexGroup>
      </ContentLayout>
      <EditModal
        active={state === 'add'}
        onClose={handleModalClose}
        onSubmit={update}
      />
      <DeleteModal
        active={state === 'delete'}
        delRequest={() => deleteWatchData(delInfo)}
        onClose={handleModalClose}
        onDelete={update}
      />
    </>
  );
}

/* 動作 */
function useWatchActions(
  setState: (value: SetStateAction<State>) => void,
  setDelInfo: (value: SetStateAction<DelInfo>) => void
) {
  const { push } = useHistory();

  const onListBtnClick = () => push(RoutePath.HostGroup);

  const onCreateBtnClick = () => {
    setState('add');
  };

  const handleModalClose = () => {
    setState('none');
    setDelInfo({ pid: '', ip: '' });
  };

  return { onListBtnClick, onCreateBtnClick, handleModalClose };
}

/* 表單 */
function useWatchTable(
  id: string,
  setState: (value: SetStateAction<State>) => void,
  setDelInfo: (value: SetStateAction<DelInfo>) => void,
  write: boolean
) {
  const [loadingState, setLoadingState] = useState<LoadingState>('none');
  const columns = useColumns(
    loadingState !== 'none',
    setState,
    setDelInfo,
    write
  );
  const options = useRef<CustomTableOptions<UniWatchItem>>({ size: 15 });
  const fetcher = useCallback(() => getWatchData(id), [id]);
  const customTable = useCustomTable(
    loadingState,
    setLoadingState,
    fetcher,
    columns,
    'pid',
    options.current
  );

  return customTable;
}

/* 欄位格式 */
function useColumns(
  loading: boolean,
  setState: (value: SetStateAction<State>) => void,
  setDelInfo: (value: SetStateAction<DelInfo>) => void,
  write: boolean
) {
  return useMemo<EuiBasicTableColumn<UniWatchItem>[]>(
    () => [
      { field: 'ip', name: '主機IP', sortable: !loading },
      { field: 'states', name: '狀態', sortable: !loading },
      { field: 'watch_path', name: '監控位置', sortable: !loading },
      { field: 'hash', name: '加密方法', sortable: !loading },
      {
        name: '刪除',
        render: (item: UniWatchItem) =>
          write ? (
            <EuiButtonIcon
              iconType="trash"
              color="danger"
              aria-label="delete"
              disabled={loading}
              onClick={() => {
                setState('delete');
                setDelInfo({ pid: item.pid, ip: item.ip });
              }}
            />
          ) : null
      }
    ],
    [loading, setDelInfo, setState, write]
  );
}

function useFilters() {
  const [options, setOptions] = useState<EuiSelectOption[]>([]);
  const hostGroup = useEuiSelect(options);

  useEffect(() => {
    getGroupList().then(res => {
      res.unshift({ group_id: '', group_name: '' });
      setOptions(
        res.map(item => ({ text: item.group_name, value: item.group_id }))
      );
    });
  }, []);

  return { hostGroup };
}
