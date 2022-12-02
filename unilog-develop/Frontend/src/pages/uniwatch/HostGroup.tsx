import React, { SetStateAction, useMemo, useRef, useState } from 'react';
import ContentLayout from 'layouts/ContentLayout';
import {
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiSpacer
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import DeleteModal from 'components/MonitorChecklist/DeleteModal';
import HostGroupEditModal from 'components/Watch/HostGroupEditModal';
import { deleteHostGroup, getGroupData } from 'utils/api/uniwatch';
import { RoutePath } from 'utils/enums';
import { UniWatchGroupItem } from 'utils/api/uniwatch/model';
import CustomTable, { LoadingState } from 'components/CustomTable';
import { CustomTableOptions, useCustomTable } from 'hooks/useCustomTable';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { SubAccessType } from 'utils/accessLevel';

type State = 'none' | 'add' | 'edit' | 'delete';

export default function HostGroup() {
  const { getAccessLevel } = useGlobalState();
  const [state, setState] = useState<State>('none');
  const [id, setId] = useState<string>('');
  const { tableProps, update } = useHostGroupTable(
    setState,
    setId,
    getAccessLevel(SubAccessType.HostGroup).write
  );
  const {
    onCancelBtnClick,
    onCreateBtnClick,
    handleModalClose
  } = useHostGroupActions(setState, setId);

  return (
    <>
      <ContentLayout title="主機群組">
        <CustomTable {...tableProps} />
        <EuiSpacer size="l" />
        <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
          {getAccessLevel(SubAccessType.HostGroup).write && (
            <EuiButton onClick={onCreateBtnClick}>新增</EuiButton>
          )}
          <div style={{ width: '16px' }} />
          <EuiButton onClick={onCancelBtnClick}>取消</EuiButton>
        </EuiFlexGroup>
      </ContentLayout>
      <HostGroupEditModal
        active={state === 'add' || state === 'edit'}
        id={id}
        onClose={handleModalClose}
        onSubmit={update}
      />
      <DeleteModal
        active={state === 'delete'}
        delRequest={() => deleteHostGroup(id)}
        onClose={handleModalClose}
        onDelete={update}
      />
    </>
  );
}

/* 動作 */
function useHostGroupActions(
  setState: (value: SetStateAction<State>) => void,
  setId: (value: SetStateAction<string>) => void
) {
  const { push } = useHistory();

  const onCancelBtnClick = () => push(RoutePath.UniWatch);

  const onCreateBtnClick = () => {
    setState('add');
  };

  const handleModalClose = () => {
    setState('none');
    setId('');
  };

  return { onCancelBtnClick, onCreateBtnClick, handleModalClose };
}

/* 表單 */
function useHostGroupTable(
  setState: (value: SetStateAction<State>) => void,
  setId: (value: SetStateAction<string>) => void,
  write: boolean
) {
  const [loadingState, setLoadingState] = useState<LoadingState>('none');
  const columns = useColumns(loadingState !== 'none', setState, setId, write);
  const options = useRef<CustomTableOptions<UniWatchGroupItem>>({ size: 15 });
  const customTable = useCustomTable(
    loadingState,
    setLoadingState,
    getGroupData,
    columns,
    'group_id',
    options.current
  );

  return customTable;
}

function useColumns(
  loading: boolean,
  setState: (value: SetStateAction<State>) => void,
  setId: (value: SetStateAction<string>) => void,
  write: boolean
) {
  const columns = useMemo<EuiBasicTableColumn<UniWatchGroupItem>[]>(
    () => [
      { field: 'group_name', name: '主機群組', sortable: !loading },
      { field: 'ip', name: '群組成員' },
      { field: 'note', name: '備註' },
      {
        name: '編輯',
        render: (item: UniWatchGroupItem) =>
          write ? (
            <EuiButtonIcon
              iconType="pencil"
              aria-label="edit"
              disabled={loading}
              onClick={() => {
                setState('edit');
                setId(item.group_id);
              }}
            />
          ) : null
      },
      {
        name: '刪除',
        render: (item: UniWatchGroupItem) =>
          write ? (
            <EuiButtonIcon
              iconType="trash"
              color="danger"
              aria-label="delete"
              disabled={loading}
              onClick={() => {
                setState('delete');
                setId(item.group_id);
              }}
            />
          ) : null
      }
    ],
    [loading, setId, setState, write]
  );

  return columns;
}
