import {
  EuiButton,
  EuiFieldText,
  EuiFormRow,
  EuiSelect,
  EuiSelectOption
} from '@elastic/eui';
import Modal from 'components/Modal';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import React, { useEffect, useState } from 'react';
import { useForm, UseFormMethods } from 'react-hook-form';
import { backupPolicyEdit } from 'utils/api/unilog';
import {
  UniLogBackupPolicyBody,
  UniLogBackupPolicyItem
} from 'utils/api/unilog/model';

interface Props {
  item?: UniLogBackupPolicyItem;
  active: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export default function PolicyEditModal(props: Props) {
  const { item, active, onClose, onSubmit } = props;
  const form = useForm<UniLogBackupPolicyBody>();
  const { handleSubmit } = form;
  const { toast } = useGlobalUI();
  const [submitting, setSubmitting] = useState(false);
  const formEl = useFormEl(item, form, submitting);

  const editType = item ? '編輯' : '新增';

  const onFormSubmit = (value: any) => {
    const data = {
      type: item ? 2 : 1,
      primaryTerm: item?.primary_term,
      seqNo: item?.seq_no,
      ...value,
      policyName: form.getValues('policyName')
    };
    setSubmitting(true);
    backupPolicyEdit(data)
      .then(() => {
        onClose();
        onSubmit();
        toast.addToast('success', '儲存成功');
      })
      .catch(() => toast.addToast('error', '儲存失敗'))
      .finally(() => setSubmitting(false));
  };

  return (
    <Modal
      active={active}
      onClose={submitting ? () => {} : onClose}
      header={`${editType}排程規則`}
      onSubmit={handleSubmit(onFormSubmit)}
      footer={
        <>
          <EuiButton type="submit" disabled={submitting} isLoading={submitting}>
            儲存
          </EuiButton>
          <EuiButton disabled={submitting} onClick={onClose}>
            取消
          </EuiButton>
        </>
      }
    >
      {formEl.map(el => (
        <EuiFormRow
          label={el.label}
          key={el.label}
          isInvalid={el.isInvalid}
          error={el.error}
        >
          {el.render()}
        </EuiFormRow>
      ))}
    </Modal>
  );
}

function useFormEl(
  item: UniLogBackupPolicyItem | undefined,
  form: UseFormMethods<UniLogBackupPolicyBody>,
  submitting: boolean
) {
  const { setValue } = form;

  useEffect(() => {
    if (!item) return;
    setTimeout(() => {
      setValue('policyName', item.policy_name);
      setValue('policyDesc', item.desc);
    }, 1);
  }, [item, setValue]);

  return [
    {
      label: '規則名稱',
      isInvalid: Boolean(form.errors?.policyName),
      error: form.errors?.policyName?.message,
      render: () => (
        <EuiFieldText
          name="policyName"
          inputRef={form.register({ required: '不能為空' })}
          disabled={submitting || !!item}
          isInvalid={Boolean(form.errors?.policyName)}
        />
      )
    },
    {
      label: '規則說明',
      isInvalid: Boolean(form.errors?.policyDesc),
      error: form.errors?.policyDesc?.message,
      render: () => (
        <EuiFieldText
          name="policyDesc"
          inputRef={form.register}
          disabled={submitting}
          isInvalid={Boolean(form.errors?.policyDesc)}
        />
      )
    },
    {
      label: '自動備份週期',
      isInvalid: Boolean(form.errors?.timeType),
      error: form.errors?.timeType?.message,
      render: () => (
        <EuiSelect
          name="timeType"
          inputRef={form.register({
            validate: value => {
              return value === '-1' ? '請設定備份週期' : true;
            }
          })}
          options={backupFreqOptions}
          disabled={submitting}
          isInvalid={Boolean(form.errors?.timeType)}
        />
      )
    }
  ];
}

const backupFreqOptions: EuiSelectOption[] = [
  { text: '', value: -1 },
  { text: '月', value: 0 },
  { text: '季', value: 1 },
  { text: '半年', value: 2 },
  { text: '年', value: 3 }
];
