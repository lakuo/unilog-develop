import { EuiLoadingSpinner } from '@elastic/eui';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: #fffa;
  z-index: 10000;
`;

interface Props {
  loading: boolean;
}
export default function InnerLoading({ loading }: Props) {
  if (!loading) return null;

  return (
    <Wrapper>
      <EuiLoadingSpinner size="xl" />
    </Wrapper>
  );
}
