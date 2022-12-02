import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiCheckbox,
  EuiFlexGroup,
  EuiFormRow,
  EuiIcon,
  EuiSelect,
  EuiSelectOption,
  EuiSpacer
} from '@elastic/eui';

import { useGlobalUI } from 'contexts/GlobalUIContext';
import { useGlobalState } from 'contexts/GlobalStateContext';
import BaseContentLayout from 'layouts/ContentLayout';
import { SubAccessType } from 'utils/accessLevel';
import { SetState } from 'utils/types';
import { getAccessLevel, getGroups, updateAccessLevel } from 'utils/api/unilog';
import { UniLogAccessLevelInfo } from 'utils/api/unilog/model';

export default function AuthorityManagement() {
  const { groupID, getAccessLevel, setAccessLevels } = useGlobalState();
  const isWrite = getAccessLevel(SubAccessType.Authority).write;

  const {
    groups,
    groupId,
    onSelectChange,
    loading: selectLoading
  } = useGroups();

  const {
    groupAccessLevel,
    setGroupAccessLevel,
    loading: tableLoading
  } = useGroupAccessLevel(groupId);

  const { submitting, onSubmit } = useAuthManagementForm(
    groupID,
    groupAccessLevel,
    setAccessLevels
  );

  const loading = selectLoading || tableLoading || submitting;
  const { columns } = useColumns(setGroupAccessLevel, isWrite, loading);

  return (
    <BaseContentLayout title="權限管理">
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiFormRow style={{ width: '200px' }}>
          <EuiSelect
            options={groups}
            value={groupId}
            onChange={onSelectChange}
            isLoading={selectLoading}
            disabled={tableLoading || submitting}
          />
        </EuiFormRow>
      </EuiFlexGroup>
      <EuiSpacer />
      <EuiBasicTable
        items={groupAccessLevel}
        columns={columns}
        loading={tableLoading}
      />
      {isWrite && (
        <>
          <EuiSpacer size="xl" />
          <EuiFlexGroup justifyContent="flexEnd">
            <EuiButton
              fill
              isLoading={submitting}
              disabled={selectLoading || tableLoading}
              onClick={onSubmit}
            >
              提交
            </EuiButton>
          </EuiFlexGroup>
        </>
      )}
    </BaseContentLayout>
  );
}

/** 取得Groups資訊 */
function useGroups() {
  const [groups, setGroups] = useState<EuiSelectOption[]>([]);
  const [groupId, setGroupId] = useState(-1);
  const [loading, setLoading] = useState(false);

  const onSelectChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    const { value } = ev.target;
    setGroupId(parseInt(value));
  };

  useEffect(() => {
    setLoading(true);
    getGroups()
      .then(res => {
        setGroups(res);
        setGroupId(res[0].value as number);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { groups, groupId, loading, onSelectChange };
}

/** 取得指定Group的Access Level */
function useGroupAccessLevel(groupId: number) {
  const [groupAccessLevel, setGroupAccessLevel] = useState<
    UniLogAccessLevelInfo[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (groupId < 0) return;
    setLoading(true);
    getAccessLevel(groupId)
      .then(res => {
        setGroupAccessLevel(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupId]);

  return { groupAccessLevel, setGroupAccessLevel, loading };
}

/** Table Columns */
function useColumns(
  setGroupAccessLevel: SetState<UniLogAccessLevelInfo[]>,
  isWrite: boolean,
  submitting: boolean
) {
  const setData = (value: UniLogAccessLevelInfo, key: string) => {
    setGroupAccessLevel(prev =>
      prev.map(item =>
        item.accessLevelId !== value.accessLevelId
          ? item
          : { ...value, [key]: !(value as any)[key] }
      )
    );
  };

  const columns: EuiBasicTableColumn<UniLogAccessLevelInfo>[] = [
    {
      field: 'mainTitleName',
      name: '主標題名稱'
    },
    {
      field: 'subTitleName',
      name: '子標題名稱'
    },
    {
      name: '讀取',
      render: (value: UniLogAccessLevelInfo) =>
        isWrite ? (
          <EuiCheckbox
            id="isRead"
            checked={value.isRead}
            disabled={submitting}
            onChange={() => setData(value, 'isRead')}
            compressed
          />
        ) : value.isRead ? (
          <EuiIcon type="check" />
        ) : null
    },
    {
      name: '寫入',
      render: (value: UniLogAccessLevelInfo) =>
        isWrite ? (
          <EuiCheckbox
            id="isWrite"
            checked={value.isWrite}
            disabled={submitting}
            onChange={() => setData(value, 'isWrite')}
            compressed
          />
        ) : value.isWrite ? (
          <EuiIcon type="check" />
        ) : null
    }
  ];

  return { columns };
}

/** 提交表單 */
function useAuthManagementForm(
  groupID: number,
  groupAccessLevel: UniLogAccessLevelInfo[],
  setAccessLevels: SetState<UniLogAccessLevelInfo[]>
) {
  const { toast } = useGlobalUI();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await updateAccessLevel(groupAccessLevel);
      const accessLevel = await getAccessLevel(groupID);
      setAccessLevels(accessLevel);
      toast.addToast('success', '修改權限成功');
    } catch {
      toast.addToast('error', '修改權限失敗');
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, onSubmit };
}
