import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ContentLayout from 'layouts/ContentLayout';
import {
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSpacer
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import DeleteModal from 'components/MonitorChecklist/DeleteModal';
import CustomTable from 'components/CustomTable';
import { RoutePath } from 'utils/enums';
import { useEuiInput } from 'hooks/useEuiInput';
import { backupIndexDelete, getBackupIndexList } from 'utils/api/unilog';
import { UniLogBackupIndexItem } from 'utils/api/unilog/model';
import { useDelayValue } from 'hooks/useDelayValue';
import { PageState } from 'utils/types';
import { useBackupRequestTable } from 'hooks/useBackupRequestTable';
import IndexEditModal from 'components/Log/Backup/IndexEditModal';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { SubAccessType } from 'utils/accessLevel';

export default function BackupList() {
  const { getAccessLevel } = useGlobalState();
  const [state, setState] = useState<PageState>('none');
  const [selectedItem, setSelectedItem] = useState<UniLogBackupIndexItem>();
  const indexName = useEuiInput();
  const delayIndexName = useDelayValue(indexName.value);
  const { update, tableProps } = useBackupRequestTable(
    delayIndexName,
    getBackupIndexList
  );
  const { loadingState } = tableProps;
  const columns = useColumns(
    loadingState !== 'none',
    setState,
    setSelectedItem,
    getAccessLevel(SubAccessType.BackupList).write
  );
  const {
    onCreateBtnClick,
    onCancelBtnClick,
    handleModalClose
  } = useIndexActions(setState, setSelectedItem);

  return (
    <>
      <ContentLayout title="排程清單">
        <EuiFlexGroup>
          <EuiFlexItem grow={1}>
            <EuiFormRow label="Index名稱">
              <EuiFieldText {...indexName} />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false} style={{ marginLeft: 'auto' }}>
            <EuiFormRow label="　">
              <EuiButton onClick={() => update()}>Refresh</EuiButton>
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="l" />
        <CustomTable {...tableProps} columns={columns} />
        <EuiSpacer size="l" />
        <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
          {getAccessLevel(SubAccessType.BackupList).write && (
            <EuiButton onClick={onCreateBtnClick}>新增</EuiButton>
          )}
          <div style={{ width: '16px' }} />
          <EuiButton onClick={onCancelBtnClick}>取消</EuiButton>
        </EuiFlexGroup>
      </ContentLayout>
      <IndexEditModal
        item={selectedItem}
        active={state === 'add' || state === 'edit'}
        onClose={handleModalClose}
        onSubmit={update}
      />
      <DeleteModal
        active={state === 'delete'}
        delRequest={() =>
          backupIndexDelete(selectedItem?.index_name, selectedItem?.policy_name)
        }
        onClose={handleModalClose}
        onDelete={update}
      />
    </>
  );
}

/* 動作 */
function useIndexActions(
  setState: Dispatch<SetStateAction<PageState>>,
  setSelectedItem: Dispatch<SetStateAction<UniLogBackupIndexItem | undefined>>
) {
  const { push } = useHistory();

  const onCreateBtnClick = () => {
    setState('add');
  };

  const onCancelBtnClick = () => {
    push(RoutePath.LogBackup);
  };

  const handleModalClose = () => {
    setState('none');
    setSelectedItem(undefined);
  };

  return { onCreateBtnClick, onCancelBtnClick, handleModalClose };
}

/* 欄位格式 */
function useColumns(
  loading: boolean,
  setState: Dispatch<SetStateAction<PageState>>,
  setSelectedItem: Dispatch<SetStateAction<UniLogBackupIndexItem | undefined>>,
  write: boolean
) {
  return useMemo<EuiBasicTableColumn<UniLogBackupIndexItem>[]>(
    () => [
      { field: 'index_name', name: 'index名稱' },
      { field: 'policy_name', name: '規則' },
      { field: 'action', name: '動作' },
      { field: 'info', name: '資訊' },
      { field: 'status', name: '狀態' },
      {
        name: '刪除',
        render: (item: UniLogBackupIndexItem) =>
          write ? (
            <EuiButtonIcon
              iconType="trash"
              color="danger"
              aria-label="delete"
              disabled={loading}
              onClick={() => {
                setState('delete');
                setSelectedItem(item);
              }}
            />
          ) : null
      }
    ],
    [loading, setSelectedItem, setState, write]
  );
}
