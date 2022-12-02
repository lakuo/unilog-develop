import {
  EuiButton,
  EuiCheckbox,
  EuiCheckboxGroupOption,
  EuiFieldText,
  EuiFlexGrid,
  EuiFlexItem,
  EuiFormRow
} from '@elastic/eui';
import Modal from 'components/Modal';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApiError } from 'utils/api';
import { addWatchData, testWatchIP } from 'utils/api/uniwatch';
import { ipRegex } from 'utils/regex';

type State = 'none' | 'loading' | 'testing' | 'submitting';

interface Props {
  active: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
export default function EditModal(props: Props) {
  const { active, onClose, onSubmit } = props;
  const {
    control,
    register,
    errors,
    handleSubmit,
    watch,
    getValues
  } = useForm();
  const {
    state,
    onFormSubmit,
    handleClose,
    handleTest,
    testResult
  } = useSubmitForm(onSubmit, onClose);

  return (
    <Modal
      active={active}
      onClose={state === 'none' ? handleClose : () => {}}
      header="新增"
      onSubmit={handleSubmit(onFormSubmit)}
      footer={
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
            onClick={handleClose}
          >
            取消
          </EuiButton>
        </>
      }
    >
      <EuiFormRow
        label="主機IP"
        isInvalid={Boolean(errors.ip)}
        error={errors?.ip?.message}
        defaultValue=""
      >
        <EuiFieldText
          name="ip"
          inputRef={register({
            required: '不能為空',
            pattern: { value: ipRegex, message: '錯誤的IP格式' }
          })}
          disabled={state !== 'none'}
          isLoading={state === 'loading'}
          isInvalid={Boolean(errors.ip)}
        />
      </EuiFormRow>
      <EuiFormRow>
        <>
          <EuiButton
            disabled={state !== 'none' || !String(watch('ip')).match(ipRegex)}
            isLoading={state === 'testing'}
            onClick={() => handleTest(String(getValues('ip')))}
          >
            測試
          </EuiButton>
          <span style={{ marginLeft: '10px', color: testResult.color }}>
            {testResult.text}
          </span>
        </>
      </EuiFormRow>
      <EuiFormRow
        label="監控位置"
        isInvalid={Boolean(errors.watchPath)}
        error={errors?.watchPath?.message}
        defaultValue=""
      >
        <EuiFieldText
          name="watchPath"
          inputRef={register({ required: '不能為空' })}
          disabled={state !== 'none'}
          isLoading={state === 'loading'}
          isInvalid={Boolean(errors.watchPath)}
        />
      </EuiFormRow>
      <EuiFormRow label="加密方式">
        <EuiFlexGrid columns={2} gutterSize="none">
          {options.map((option, i) => (
            <EuiFlexItem key={option.id}>
              <Controller
                name={`hash.${option.id}`}
                control={control}
                defaultValue={false}
                render={({ value, onChange }) => (
                  <>
                    <div>{value}</div>
                    <EuiCheckbox
                      id={option.id}
                      label={option.label}
                      checked={value}
                      disabled={state !== 'none'}
                      onChange={e => onChange(e.target.checked)}
                    />
                  </>
                )}
              />
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>
      </EuiFormRow>
    </Modal>
  );
}

function useSubmitForm(onSubmit: () => void, onClose: () => void) {
  const { toast } = useGlobalUI();
  const [state, setState] = useState<State>('none');
  const [testResult, setTestResult] = useState({
    color: '',
    text: ''
  });

  const handleTest = (ip: string) => {
    if (!ip.match(ipRegex)) {
      setTestResult({ color: '#BD271E', text: '錯誤的IP格式' });
      return;
    }
    setTestResult({ color: '', text: '' });
    setState('testing');
    testWatchIP(ip)
      .then(res => setTestResult({ color: '', text: res.data.statusInfo }))
      .catch((err: ApiError) =>
        setTestResult({ color: '#BD271E', text: err.message })
      )
      .finally(() => setState('none'));
  };

  const onFormSubmit = (value: any) => {
    setState('submitting');
    addWatchData(value)
      .then(() => {
        handleClose();
        onSubmit();
        toast.addToast('success', '新增監控介面成功');
      })
      .catch((err: ApiError) =>
        toast.addToast(
          'error',
          err.status === 403 ? err.message : '新增監控介面失敗'
        )
      )
      .finally(() => setState('none'));
  };

  const handleClose = () => {
    setTestResult({ color: '', text: '' });
    onClose();
  };

  return {
    state,
    onFormSubmit,
    handleClose,
    handleTest,
    testResult
  };
}

const options: EuiCheckboxGroupOption[] = [
  { id: 'md5', label: 'md5' },
  { id: 'sha1', label: 'sha1' },
  { id: 'sha256', label: 'sha256' },
  { id: 'sha512', label: 'sha512' },
  { id: 'crc32', label: 'crc32' }
];
