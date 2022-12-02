import React, { useEffect, useState } from 'react';
import {
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiButton,
  EuiSelectOption,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitch,
  EuiSwitchEvent
} from '@elastic/eui';
import { UseFormMethods } from 'react-hook-form';
import Modal, { useModal } from 'components/Modal';
import { useGlobalState } from 'contexts/GlobalStateContext';
import { getGroups, getAccount } from 'utils/api/unilog';
import { UniLogAccountInfo } from 'utils/api/unilog/model';

export type FormMode = 'add' | 'edit';

interface Props {
  active: boolean;
  mode: FormMode;
  loading: boolean;
  editId: string;
  groups: EuiSelectOption[];
  accountInfo?: UniLogAccountInfo;
  form: UseFormMethods<UniLogAccountInfo>;
  onAddSubmit: (value: UniLogAccountInfo) => Promise<any>;
  onEditSubmit: (id: string, value: UniLogAccountInfo) => Promise<any>;
  onClose: () => void;
}
export default function EditFormModal(props: Props) {
  const {
    active,
    mode,
    loading,
    editId,
    groups,
    accountInfo,
    form,
    onAddSubmit,
    onEditSubmit,
    onClose
  } = props;

  const { isLocal } = useGlobalState();
  const { register, handleSubmit } = form;
  const alarmSwitch = useEuiSwitch(active, accountInfo?.isOnAlarm ?? false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (value: UniLogAccountInfo) => {
    const submitValue: UniLogAccountInfo = {
      ...value,
      isOnAlarm: alarmSwitch.checked,
      isDelete: false
    };

    setSubmitting(true);
    if (mode === 'add') {
      onAddSubmit(submitValue).finally(() => setSubmitting(false));
    } else {
      onEditSubmit(editId, submitValue).finally(() => setSubmitting(false));
    }
  };

  return (
    <Modal
      active={active}
      header={(mode === 'add' ? '新增' : '編輯') + '使用者'}
      width="400px"
      onClose={onClose}
    >
      <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
        {mode === 'add' && (
          <>
            <EuiFormRow label="帳號">
              <EuiFieldText
                name="userAccount"
                inputRef={register}
                disabled={submitting}
              />
            </EuiFormRow>
            <EuiSpacer />
          </>
        )}
        {(isLocal || mode === 'add') && (
          <EuiFormRow label="密碼">
            <EuiFieldText
              name="mima"
              type="password"
              inputRef={register}
              disabled={submitting}
            />
          </EuiFormRow>
        )}
        <EuiSpacer />
        <EuiFormRow label="群組">
          <EuiSelect
            name="groupId"
            inputRef={register}
            options={groups}
            defaultValue={accountInfo?.groupId.toString()}
            disabled={loading || submitting}
            isLoading={loading}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiFlexGroup>
          <EuiFlexItem grow={2}>
            <EuiFormRow label="姓氏">
              <EuiFieldText
                name="userLastName"
                inputRef={register}
                defaultValue={accountInfo?.userLastName}
                disabled={(mode === 'edit' && loading) || submitting}
                isLoading={mode === 'edit' && loading}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={3}>
            <EuiFormRow label="名字">
              <EuiFieldText
                name="userFirstName"
                inputRef={register}
                defaultValue={accountInfo?.userFirstName}
                disabled={(mode === 'edit' && loading) || submitting}
                isLoading={mode === 'edit' && loading}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />
        <EuiFormRow label="電子信箱">
          <EuiFieldText
            name="userEmail"
            type="email"
            inputRef={register}
            defaultValue={accountInfo?.userEmail}
            disabled={(mode === 'edit' && loading) || submitting}
            isLoading={mode === 'edit' && loading}
          />
        </EuiFormRow>
        <EuiSpacer />
        <EuiSwitch
          label="告警"
          checked={alarmSwitch.checked}
          onChange={alarmSwitch.onChange}
          disabled={(mode === 'edit' && loading) || submitting}
        />
        <EuiSpacer size="xl" />
        <EuiFormRow style={{ float: 'right' }}>
          <EuiButton
            type="submit"
            fill
            disabled={loading}
            isLoading={submitting}
          >
            提交
          </EuiButton>
        </EuiFormRow>
      </EuiForm>
    </Modal>
  );
}

export function useEditFormModal(form: UseFormMethods<UniLogAccountInfo>) {
  const { open, close, ...others } = useModal();
  const [mode, setMode] = useState<FormMode>('add');
  const [id, setId] = useState('');
  const [groups, setGroups] = useState<EuiSelectOption[]>([]);
  const [accountInfo, setAccountInfo] = useState<UniLogAccountInfo>();
  const [loading, setLoading] = useState(false);

  const openAddFormModal = () => {
    setMode('add');
    open();
    setLoading(true);
    getGroups().then(res => {
      setGroups(res);
      setLoading(false);
    });
  };

  const openEditFormModal = (id: string) => {
    setMode('edit');
    setId(id);
    open();
    setLoading(true);
    Promise.all([getGroups(), getAccount(id)]).then(res => {
      setGroups(res[0]);
      setAccountInfo(res[1]);
      form.reset(res[1]);
      setLoading(false);
    });
  };

  const closeModal = () => {
    setAccountInfo(undefined);
    form.reset({
      uuid: '',
      groupId: 1,
      userLastName: '',
      userFirstName: '',
      userEmail: '',
      isOnAlarm: false
    });
    close();
  };

  return {
    ...others,
    mode,
    loading,
    id,
    groups,
    accountInfo,
    openAddFormModal,
    openEditFormModal,
    closeModal
  };
}

function useEuiSwitch(active: boolean, defaultChecked: boolean) {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    if (active) {
      setChecked(defaultChecked);
    }
  }, [active, defaultChecked]);

  const onChange = (ev: EuiSwitchEvent) => {
    const { checked } = ev.target;
    setChecked(checked);
  };

  return { checked, onChange };
}
