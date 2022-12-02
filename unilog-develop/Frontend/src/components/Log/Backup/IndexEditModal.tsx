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
import { backupIndexEdit } from 'utils/api/unilog';
import {
  UniLogBackupIndexBody,
  UniLogBackupIndexItem
} from 'utils/api/unilog/model';

interface Props {
  item?: UniLogBackupIndexItem;
  active: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export default function IndexEditModal(props: Props) {
  const { item, active, onClose, onSubmit } = props;
  const form = useForm<UniLogBackupIndexBody>();
  const { handleSubmit } = form;
  const { toast } = useGlobalUI();
  const [submitting, setSubmitting] = useState(false);
  const formEl = useFormEl(item, form, submitting);

  const editType = item ? '編輯' : '新增';

  const onFormSubmit = (value: any) => {
    setSubmitting(true);
    backupIndexEdit(value)
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
      header={`${editType}套用規則`}
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
  item: UniLogBackupIndexItem | undefined,
  form: UseFormMethods<UniLogBackupIndexBody>,
  submitting: boolean
) {
  const { setValue } = form;

  useEffect(() => {
    if (!item) return;
  }, [item, setValue]);

  return [
    {
      label: '索引名稱',
      isInvalid: Boolean(form.errors?.indexName),
      error: form.errors?.indexName?.message,
      render: () => (
        <EuiFieldText
          name="indexName"
          inputRef={form.register({ required: '不能為空' })}
          disabled={submitting || !!item}
          isInvalid={Boolean(form.errors?.indexName)}
        />
      )
    },
    {
      label: '規則名稱',
      isInvalid: Boolean(form.errors?.policyName),
      error: form.errors?.policyName?.message,
      render: () => (
        <EuiFieldText
          name="policyName"
          inputRef={form.register({ required: '不能為空' })}
          disabled={submitting}
          isInvalid={Boolean(form.errors?.policyName)}
        />
      )
    },
    {
      label: '密碼',
      isInvalid: Boolean(form.errors?.zipPwd),
      error: form.errors?.zipPwd?.message,
      render: () => (
        <EuiFieldText
          name="zipPwd"
          inputRef={form.register({ required: '不能為空' })}
          disabled={submitting}
          isInvalid={Boolean(form.errors?.zipPwd)}
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
