import {
  EuiButton,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFieldText,
  EuiFormRow,
  EuiTextArea
} from '@elastic/eui';
import Modal from 'components/Modal';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  addHostGroup,
  editHostGroup,
  getGroupData,
  getWatchIpList
} from 'utils/api/uniwatch';

type State = 'none' | 'loading' | 'testing' | 'submitting';

interface Props {
  id?: string;
  active: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export default function HostGroupEditModal(props: Props) {
  const { id, active, onClose, onSubmit } = props;
  const {
    control,
    register,
    handleSubmit,
    setValue,
    errors,
    watch
  } = useForm();
  const [state, setState] = useState<State>('none');
  const hostMember = useHostMemberOptions(active);

  const header = id ? '編輯' : '新增';

  const onFormSubmit = (value: any) => {
    const action = id ? editHostGroup : addHostGroup;
    setState('submitting');
    if (id) value.groupId = id;
    action(value)
      .then(() => {
        onClose();
        onSubmit();
      })
      .finally(() => setState('none'));
  };

  useEffect(() => {
    if (!active) return;
    if (!id) return;
    setState('loading');
    getGroupData()
      .then(res => {
        const item = res.find(item => item.group_id === id);
        if (!item) onClose();
        setValue('groupName', item?.group_name);
        setValue(
          'ip',
          item?.ip.split(',').map(value => ({ label: value })),
          { shouldDirty: true }
        );
        setValue('note', item?.note);
      })
      .finally(() => setState('none'));
  }, [active, id, onClose, setValue]);

  return (
    <Modal
      active={active}
      onClose={state === 'none' ? onClose : () => {}}
      header={header}
      onSubmit={handleSubmit(onFormSubmit)}
      footer={<Footer state={state} onClose={onClose} />}
    >
      <EuiFormRow
        label="群組名稱"
        isInvalid={Boolean(errors.groupName)}
        error={errors?.groupName?.message}
      >
        <EuiFieldText
          name="groupName"
          inputRef={register({ required: '不能為空' })}
          disabled={state !== 'none'}
          isLoading={state === 'loading'}
          isInvalid={Boolean(errors.groupName)}
        />
      </EuiFormRow>
      <EuiFormRow label="主機成員">
        <Controller
          control={control}
          name="ip"
          defaultValue={[]}
          render={({ onChange }) => (
            <EuiComboBox
              {...hostMember}
              isLoading={hostMember.isLoading || state === 'loading'}
              isDisabled={hostMember.isLoading || state === 'loading'}
              selectedOptions={watch('ip')}
              onChange={onChange}
              inputRef={register('ip')}
            />
          )}
        />
      </EuiFormRow>
      <EuiFormRow label="備註">
        <EuiTextArea
          name="note"
          inputRef={register}
          disabled={state !== 'none'}
        />
      </EuiFormRow>
    </Modal>
  );
}

interface FooterProps {
  state: State;
  onClose: () => void;
}
function Footer({ state, onClose }: FooterProps) {
  return (
    <>
      <EuiButton
        type="submit"
        disabled={state !== 'none'}
        isLoading={state === 'submitting'}
      >
        儲存
      </EuiButton>
      <EuiButton
        style={{ marginLeft: '10px' }}
        disabled={state !== 'none'}
        onClick={onClose}
      >
        取消
      </EuiButton>
    </>
  );
}

function useHostMemberOptions(active: boolean) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<EuiComboBoxOptionOption<string>[]>([]);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    getWatchIpList()
      .then(res => {
        setOptions(res.ip.map(value => ({ label: value })));
      })
      .finally(() => setLoading(false));
  }, [active]);

  return { options, isLoading: loading };
}
