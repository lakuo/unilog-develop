import React, { ReactNode } from 'react';
import { EuiPageContent } from '@elastic/eui';
import PageLayout from './PageLayout';

interface Props {
  title: ReactNode;
  children?: ReactNode;
  maxBodyWidth?: string;
}
export default function ContentLayout(props: Props) {
  const { title, maxBodyWidth, children } = props;

  return (
    <PageLayout title={title}>
      {children && (
        <EuiPageContent style={{ maxWidth: maxBodyWidth ?? 'auto' }}>
          {children}
        </EuiPageContent>
      )}
    </PageLayout>
  );
}
