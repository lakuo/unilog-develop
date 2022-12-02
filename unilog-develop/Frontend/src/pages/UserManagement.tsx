import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Direction, EuiBasicTableColumn, EuiIcon } from '@elastic/eui';
import { Pagination } from '@elastic/eui/src/components/basic_table/pagination_bar';
import { useForm } from 'react-hook-form';

import { useGlobalState } from 'contexts/GlobalStateContext';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import BaseContentLayout from 'layouts/ContentLayout';
import ControlBar, {
  useSearchInput
} from 'components/UserManagement/ControlBar';
import ManagementTable, {
  useManagementTable
} from 'components/UserManagement/ManagementTable';
import EditFormModal, {
  useEditFormModal
} from 'components/UserManagement/EditFormModal';
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAccounts
} from 'utils/api/unilog';
import { SubAccessType } from 'utils/accessLevel';
import { UniLogAccountInfo } from 'utils/api/unilog/model';

export default function UserManagement() {
  const { pagination, sort, onTableChange } = useManagementTable();
  const form = useForm<UniLogAccountInfo>();

  const {
    id,
    openAddFormModal,
    openEditFormModal,
    closeModal,
    ...formModalParas
  } = useEditFormModal(form);

  const {
    loading,
    columns,
    dataItems,
    addDataItem,
    editDataItem,
    setSelectedItems
  } = useUserManagement(openEditFormModal, closeModal);

  const { value, onChange } = useSearchInput();
  const itemsOfPage = useItemsOfPage(dataItems, pagination, sort, value);

  return (
    <BaseContentLayout title="使用者管理">
      <ControlBar
        loading={loading}
        inputValue={value}
        onInputChange={onChange}
        onAddButtonClick={openAddFormModal}
      />
      <ManagementTable
        loading={loading}
        columns={columns}
        items={itemsOfPage}
        pagination={{ ...pagination, totalItemCount: dataItems.length }}
        sort={sort}
        onSelectionChange={setSelectedItems}
        onTableChange={onTableChange}
      />
      <EditFormModal
        {...formModalParas}
        editId={id}
        onClose={closeModal}
        onAddSubmit={addDataItem}
        onEditSubmit={editDataItem}
        form={form}
      />
    </BaseContentLayout>
  );
}

/** 使用者管理頁面主要功能 */
function useUserManagement(openEditFormModal: any, closeModal: any) {
  const { getAccessLevel } = useGlobalState();
  const { confirmModal } = useGlobalUI();
  const { toast } = useGlobalUI();
  const [loading, setLoading] = useState(false);
  const [dataItems, setDataItems] = useState<UniLogAccountInfo[]>([]);
  const [selectedItems, setSelectedItems] = useState<UniLogAccountInfo[]>([]);

  const isWrite = getAccessLevel(SubAccessType.User).write;

  const updateDataItems = useCallback(() => {
    setLoading(true);
    getAccounts()
      .then(res => {
        setDataItems(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addDataItem = (value: UniLogAccountInfo) => {
    return addAccount(value)
      .then(() => toast.addToast('success', '新增帳號成功'))
      .catch(() => toast.addToast('error', '已有該帳號'))
      .finally(() => {
        closeModal();
        updateDataItems();
      });
  };

  const editDataItem = (id: string, value: UniLogAccountInfo) => {
    return editAccount(id, value)
      .then(() => toast.addToast('success', '編輯帳號成功'))
      .catch(() => toast.addToast('error', '編輯帳號失敗'))
      .finally(() => {
        closeModal();
        updateDataItems();
      });
  };

  const deleteDataItem = useCallback(
    (uuid: string) => {
      confirmModal.close();
      setLoading(true);
      deleteAccount(uuid)
        .then(() => toast.addToast('success', '刪除帳號成功'))
        .catch(() => toast.addToast('error', '刪除帳號失敗'))
        .finally(() => updateDataItems());
    },
    [confirmModal, toast, updateDataItems]
  );

  const columns = useMemo<EuiBasicTableColumn<any>[]>(
    () => [
      {
        name: '姓名',
        sortable: () => true,
        render: (value: UniLogAccountInfo) =>
          `${value.userLastName} ${value.userFirstName}`
      },
      {
        field: 'groupCNName',
        name: '群組',
        sortable: true
      },
      {
        name: '告警',
        sortable: () => true,
        render: (value: UniLogAccountInfo) =>
          value.isOnAlarm ? <EuiIcon type="check" /> : null
      },
      {
        name: '動作',
        actions: isWrite
          ? [
              {
                name: 'edit',
                description: '編輯',
                type: 'icon',
                icon: 'pencil',
                enabled: () => !loading,
                onClick: (value: UniLogAccountInfo) =>
                  openEditFormModal(value.uuid)
              },
              {
                name: 'delete',
                description: '刪除',
                type: 'icon',
                icon: 'trash',
                color: 'danger',
                enabled: () => !loading,
                onClick: (value: UniLogAccountInfo) =>
                  confirmModal.open({
                    title: `刪除使用者 ${value.userLastName} ${value.userFirstName}`,
                    children: '已刪除的使用者無法還原，確定要刪除嗎？',
                    buttonColor: 'danger',
                    confirmButtonText: '刪除',
                    cancelButtonText: '取消',
                    onConfirm: () => deleteDataItem(value.uuid)
                  })
              }
            ]
          : []
      }
    ],
    [confirmModal, deleteDataItem, isWrite, loading, openEditFormModal]
  );

  useEffect(() => {
    updateDataItems();
  }, [updateDataItems]);

  return {
    loading,
    columns,
    dataItems,
    showDeleteButton: selectedItems.length > 0,
    addDataItem,
    editDataItem,
    deleteDataItem,
    setSelectedItems
  };
}

/** 當頁顯示的資料 */
function useItemsOfPage(
  dataItems: UniLogAccountInfo[],
  pagination: Pagination,
  sort: { field: string; direction: Direction },
  value: string
) {
  const itemsOfPage = useMemo(() => {
    let temp = JSON.parse(JSON.stringify(dataItems)) as UniLogAccountInfo[];
    temp = temp
      .filter(item => item.account !== 'elkadmin')
      .filter(
        item =>
          (item.userLastName + item.userFirstName).includes(value) ||
          item.groupCNName?.includes(value)
      );
    temp = temp.sort((a, b) => {
      const _a = a[sortFields[sort.field]] as any;
      const _b = b[sortFields[sort.field]] as any;
      let result = _a > _b ? 1 : -1;
      result *= sort.direction === 'asc' ? 1 : -1;
      return result;
    });

    const start = pagination.pageSize * pagination.pageIndex;
    const end = start + pagination.pageSize;
    return temp.slice(start, end);
  }, [
    dataItems,
    pagination.pageIndex,
    pagination.pageSize,
    sort.direction,
    sort.field,
    value
  ]);

  return itemsOfPage;
}

const sortFields: { [key: string]: keyof UniLogAccountInfo } = {
  姓名: 'userLastName',
  groupCNName: 'groupId',
  告警: 'isOnAlarm'
};
