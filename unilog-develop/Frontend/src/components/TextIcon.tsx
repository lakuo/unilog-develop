import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}
export default function SideNavTextIcon({ children }: Props) {
  return (
    <span style={{ marginRight: '12px' }}>
      <TextIcon>{children}</TextIcon>
    </span>
  );
}

const TextIcon = styled.div`
  height: 18px;
  line-height: 18px;
  width: 18px;
  margin-left: -1.5px;
  text-align: center;
  border-radius: 4px;
  font-size: 20px;
  font-family: Lay Of The Land;
`;
