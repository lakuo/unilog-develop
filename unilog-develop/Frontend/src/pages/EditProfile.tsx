import React, { useEffect, useState } from 'react';
import {
  EuiButton,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui';
import { useForm } from 'react-hook-form';

import ContentLayout from 'layouts/ContentLayout';
import { editProfile, getCurrentAccount } from 'utils/api/unilog';
import { useGlobalUI } from 'contexts/GlobalUIContext';
import { FormReset } from 'utils/types';
import { UniLogProfileBody } from 'utils/api/unilog/model';

export default function EditProfile() {
  const { register, handleSubmit, reset } = useForm<UniLogProfileBody>();
  const { loading, submitting, onSubmit } = useEditProfile(reset);

  return (
    <ContentLayout title="編輯基本資料" maxBodyWidth="400px">
      <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
        <EuiFlexGroup>
          <EuiFlexItem grow={2}>
            <EuiFormRow label="姓氏">
              <EuiFieldText
                name="userLastName"
                inputRef={register}
                isLoading={loading}
                disabled={loading || submitting}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={3}>
            <EuiFormRow label="名字">
              <EuiFieldText
                name="userFirstName"
                inputRef={register}
                isLoading={loading}
                disabled={loading || submitting}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="m" />
        <EuiFormRow label="電子信箱">
          <EuiFieldText
            type="email"
            name="userEmail"
            inputRef={register}
            isLoading={loading}
            disabled={loading || submitting}
          />
        </EuiFormRow>
        <EuiSpacer size="xl" />
        <EuiButton type="submit" fill isLoading={submitting} disabled={loading}>
          提交
        </EuiButton>
      </EuiForm>
    </ContentLayout>
  );
}

function useEditProfile(reset: FormReset<UniLogProfileBody>) {
  const { toast } = useGlobalUI();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (profile: UniLogProfileBody) => {
    setSubmitting(true);
    editProfile(profile)
      .then(() => toast.addToast('success', '修改基本資料成功'))
      .catch(() => toast.addToast('error', '修改基本資料失敗'))
      .finally(() => setSubmitting(false));
  };

  useEffect(() => {
    setLoading(true);
    getCurrentAccount().then(res => {
      reset({
        userLastName: res.userLastName,
        userFirstName: res.userFirstName,
        userEmail: res.userEmail ?? ''
      });
      setLoading(false);
    });
  }, [reset]);

  return { loading, submitting, onSubmit };
}
