import { EuiButton, EuiFieldText, EuiFormRow } from '@elastic/eui';
import Modal from 'components/Modal';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import { useEuiInput } from 'hooks/useEuiInput';
import React, { useState } from 'react';
import { useForm, UseFormMethods } from 'react-hook-form';
import { backupRestore } from 'utils/api/unilog';

interface Props {
  id: string;
  active: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export default function RecoverModal(props: Props) {
  const { id, active, onClose, onSubmit } = props;
  const form = useForm();
  const { handleSubmit } = form;
  const { toast } = useGlobalUI();
  const [submitting, setSubmitting] = useState(false);
  const formEl = useFormEl(id, form);

  const onFormSubmit = (value: any) => {
    const data = {
      ...value,
      zipName: id
    };
    setSubmitting(true);
    backupRestore(data)
      .then(() => {
        onClose();
        onSubmit();
        toast.addToast('success', '復原成功');
      })
      .catch(() => toast.addToast('error', '復原失敗'))
      .finally(() => setSubmitting(false));
  };

  return (
    <Modal
      active={active}
      onClose={submitting ? () => {} : onClose}
      header="Log復原"
      onSubmit={handleSubmit(onFormSubmit)}
      footer={
        <>
          <EuiButton type="submit" disabled={submitting} isLoading={submitting}>
            復原
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
          <EuiFieldText
            {...el.input}
            name={el.name}
            inputRef={el.inputRef}
            disabled={submitting || el.disabled}
            isInvalid={el.isInvalid}
          />
        </EuiFormRow>
      ))}
    </Modal>
  );
}

function useFormEl(id: string, form: UseFormMethods) {
  const pwInput = useEuiInput();
  const nameInput = {
    value: id,
    onChange: () => {}
  };

  return [
    {
      label: '備份檔名',
      name: 'zipName',
      inputRef: form.register,
      input: nameInput,
      disabled: true
    },
    {
      label: '檔案密碼',
      name: 'zipPwd',
      inputRef: form.register({ required: '不能為空' }),
      input: pwInput,
      isInvalid: Boolean(form.errors?.zipPwd),
      error: form.errors?.zipPwd?.message
    }
  ];
}
