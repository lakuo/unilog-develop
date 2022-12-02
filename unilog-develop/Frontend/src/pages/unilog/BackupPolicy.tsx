import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ContentLayout from 'layouts/ContentLayout';
import {
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiFieldText,
  EuiFlexGroup,
  EuiFormRow,
  EuiSpacer
} from '@elastic/eui';
import { useHistory } from 'react-router-dom';
import DeleteModal from 'components/MonitorChecklist/DeleteModal';
import CustomTable from 'components/CustomTable';
import { RoutePath } from 'utils/enums';
import { useEuiInput } from 'hooks/useEuiInput';
import { backupPolicyDelete, getBackupPolicies } from 'utils/api/unilog';
import { UniLogBackupPolicyItem } from 'utils/api/unilog/model';
import PolicyEditModal from 'components/Log/Backup/PolicyEditModal';
import { useDelayValue } from 'hooks/useDelayValue';
import { dateTimeToString } from 'utils/scripts';
import { PageState } from 'utils/types';
import { useBackupRequestTable } from 'hooks/useBackupRequestTable';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { SubAccessType } from 'utils/accessLevel';

export default function BackupPolicy() {
  const { getAccessLevel } = useGlobalState();
  const [state, setState] = useState<PageState>('none');
  const [selectedItem, setSelectedItem] = useState<UniLogBackupPolicyItem>();
  const policyName = useEuiInput();
  const delayPolicyName = useDelayValue(policyName.value);
  const { update, tableProps } = useBackupRequestTable(
    delayPolicyName,
    getBackupPolicies
  );
  const { loadingState } = tableProps;
  const columns = useColumns(
    loadingState !== 'none',
    setState,
    setSelectedItem,
    getAccessLevel(SubAccessType.BackupPolicy).write
  );
  const {
    onCreateBtnClick,
    onCancelBtnClick,
    handleModalClose
  } = usePolicyActions(setState, setSelectedItem);

  return (
    <>
      <ContentLayout title="排程規則">
        <EuiFormRow label="Policy名稱">
          <EuiFieldText {...policyName} />
        </EuiFormRow>
        <EuiSpacer size="l" />
        <CustomTable {...tableProps} columns={columns} />
        <EuiSpacer size="l" />
        <EuiFlexGroup justifyContent="flexEnd" style={{ margin: 0 }}>
          {getAccessLevel(SubAccessType.BackupPolicy).write && (
            <EuiButton onClick={onCreateBtnClick}>新增</EuiButton>
          )}
          <div style={{ width: '16px' }} />
          <EuiButton onClick={onCancelBtnClick}>取消</EuiButton>
        </EuiFlexGroup>
      </ContentLayout>
      <PolicyEditModal
        item={selectedItem}
        active={state === 'add' || state === 'edit'}
        onClose={handleModalClose}
        onSubmit={update}
      />
      <DeleteModal
        active={state === 'delete'}
        delRequest={() => backupPolicyDelete(selectedItem?.policy_name)}
        onClose={handleModalClose}
        onDelete={update}
      />
    </>
  );
}

/* 動作 */
function usePolicyActions(
  setState: Dispatch<SetStateAction<PageState>>,
  setSelectedItem: Dispatch<SetStateAction<UniLogBackupPolicyItem | undefined>>
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
  setSelectedItem: Dispatch<SetStateAction<UniLogBackupPolicyItem | undefined>>,
  write: boolean
) {
  return useMemo<EuiBasicTableColumn<UniLogBackupPolicyItem>[]>(
    () => [
      { field: 'policy_name', name: 'Policy' },
      { field: 'desc', name: '說明' },
      {
        field: 'last_updated_time',
        name: '更新時間',
        render: (value: string) => dateTimeToString(value)
      },
      {
        name: '編輯',
        render: (item: UniLogBackupPolicyItem) =>
          write ? (
            <EuiButtonIcon
              iconType="pencil"
              color="primary"
              aria-label="edit"
              disabled={loading}
              onClick={() => {
                setState('edit');
                setSelectedItem(item);
              }}
            />
          ) : null
      },
      {
        name: '刪除',
        render: (item: UniLogBackupPolicyItem) =>
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
