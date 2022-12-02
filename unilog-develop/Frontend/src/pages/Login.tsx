import React, { useState } from 'react';
import {
  EuiButton,
  EuiFieldPassword,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle
} from '@elastic/eui';
import { useForm } from 'react-hook-form';

import { useGlobalState } from 'contexts/GlobalStateContext';
import { login } from 'utils/api/unilog';
import { UniLogLoginData } from 'utils/api/unilog/model';
import { ApiError } from 'utils/api';
import { useGlobalUI } from 'contexts/GlobalUIContext';

export default function Login() {
  const { register, handleSubmit, errors } = useForm<UniLogLoginData>({
    defaultValues: {
      username: process.env.NODE_ENV === 'development' ? 'elkadmin' : '',
      password: process.env.NODE_ENV === 'development' ? '1qaz@WSX3edc' : ''
    }
  });
  const { submitting, onSubmit } = useLoginForm();

  return (
    <EuiPage style={{ height: '100vh' }}>
      <EuiPageBody component="div">
        <EuiPageContent verticalPosition="center" horizontalPosition="center">
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection style={{ width: '100%' }}>
              <EuiTitle size="l">
                <h1 style={{ textAlign: 'center' }}>UNILOG</h1>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
              <EuiFormRow
                label="帳號"
                isInvalid={Boolean(errors.username)}
                error={errors.username?.message}
              >
                <EuiFieldText
                  name="username"
                  inputRef={register({ required: '不能為空' })}
                  icon="user"
                  compressed
                  disabled={submitting}
                  isInvalid={Boolean(errors.username)}
                />
              </EuiFormRow>
              <EuiFormRow
                label="密碼"
                isInvalid={Boolean(errors.password)}
                error={errors.password?.message}
              >
                <EuiFieldPassword
                  name="password"
                  inputRef={register({ required: '不能為空' })}
                  compressed
                  disabled={submitting}
                  isInvalid={Boolean(errors.password)}
                />
              </EuiFormRow>
              <EuiButton
                type="submit"
                size="s"
                fullWidth
                fill
                isLoading={submitting}
              >
                登入
              </EuiButton>
            </EuiForm>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

function useLoginForm() {
  const [submitting, setSubmitting] = useState(false);
  const { setIsLoggedIn } = useGlobalState();
  const { toast } = useGlobalUI();

  const onSubmit = (loginData: UniLogLoginData) => {
    setSubmitting(true);
    login(loginData)
      .then(() => setIsLoggedIn(true))
      .catch((err: ApiError) => {
        if (err.status === 401) {
          toast.addToast('error', '帳號或密碼錯誤');
        } else {
          toast.addToast('error', err.message);
        }
        setSubmitting(false);
      });
  };

  return { submitting, onSubmit };
}
