import { EuiLoadingSpinner } from '@elastic/eui';
import React from 'react';
import styled from 'styled-components';

interface Props {
  backgroundColor?: string;
}

const Wrapper = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${p => p.backgroundColor ?? '#fafbfd'};
  z-index: 10000;
`;

export default function AppLoading({ backgroundColor }: Props) {
  return (
    <Wrapper backgroundColor={backgroundColor}>
      <EuiLoadingSpinner size="xl" />
    </Wrapper>
  );
}
