import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EuiButton, EuiForm, EuiSpacer } from '@elastic/eui';

import { useGlobalUI } from 'contexts/GlobalUIContext';
import ContentLayout from 'layouts/ContentLayout';
import PasswordInput from 'components/PasswordInput';
import { changePassword } from 'utils/api/unilog';
import { FormReset, FormSetError } from 'utils/types';
import { UniLogPasswordBody } from 'utils/api/unilog/model';

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    reset
  } = useForm<UniLogPasswordBody>();
  const { submitting, onSubmit } = useChangePwdForm(setError, reset);

  return (
    <ContentLayout title="修改密碼" maxBodyWidth="360px">
      <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          label="舊密碼"
          name="current"
          inputRef={register({ required: true })}
          error={errors.current}
          disabled={submitting}
        />
        <PasswordInput
          label="新密碼"
          name="new"
          inputRef={register({ required: true })}
          error={errors.new}
          disabled={submitting}
        />
        <PasswordInput
          label="確認密碼"
          name="confirm"
          inputRef={register({ required: true })}
          error={errors.confirm}
          disabled={submitting}
        />
        <EuiSpacer />
        <EuiButton type="submit" fill isLoading={submitting}>
          提交
        </EuiButton>
      </EuiForm>
    </ContentLayout>
  );
}

function useChangePwdForm(
  setError: FormSetError,
  reset: FormReset<UniLogPasswordBody>
) {
  const { toast } = useGlobalUI();
  const [submitting, setSubmitting] = useState(false);

  const checkPasswords = (passwords: UniLogPasswordBody): boolean => {
    let hasError = false;
    if (passwords.new === passwords.current) {
      setError('new', { type: 'validate', message: '新密碼不可和舊密碼相同' });
      hasError = true;
    }
    if (passwords.confirm !== passwords.new) {
      setError('confirm', { type: 'validate', message: '確認密碼錯誤' });
      hasError = true;
    }
    return hasError;
  };

  const onSubmit = (passwords: UniLogPasswordBody) => {
    const hasError = checkPasswords(passwords);
    if (hasError) return;

    setSubmitting(true);
    changePassword(passwords)
      .then(() => toast.addToast('success', '修改密碼成功'))
      .catch(() => toast.addToast('error', '修改密碼失敗'))
      .finally(() => {
        reset({ current: '', new: '', confirm: '' });
        setSubmitting(false);
      });
  };

  return { submitting, onSubmit };
}
