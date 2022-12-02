import React, { ReactNode, useEffect } from 'react';
import { EuiPage, EuiPageBody, EuiPageHeader, EuiTitle } from '@elastic/eui';

interface Props {
  title: ReactNode;
  children?: ReactNode;
}
export default function PageLayout(props: Props) {
  const { title, children } = props;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <EuiPage className="euiNavDrawerPage">
      <EuiPageBody className="euiNavDrawerPage__pageBody">
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>{title}</h1>
          </EuiTitle>
        </EuiPageHeader>
        {children}
      </EuiPageBody>
    </EuiPage>
  );
}
