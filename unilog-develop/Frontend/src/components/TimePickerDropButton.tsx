import React, { useState } from 'react';
import styled from 'styled-components';
import {
  EuiIcon,
  EuiListGroup,
  EuiListGroupItem,
  EuiPopover
} from '@elastic/eui';

const DropButtonWrapper = styled.div`
  text-align: center;
  width: 40px;
  line-height: 42px;
  box-shadow: 0 1px 1px -1px rgba(152, 162, 179, 0.2),
    0 3px 2px -2px rgba(152, 162, 179, 0.2),
    inset 0 0 0 1px rgba(15, 39, 118, 0.1);
  background: #fbfcfd;
  cursor: pointer;
  :hover {
    background: #f5f7fa;
  }
`;

interface Props {
  options?: { label: string; value: string }[];
  onClick: (value: string[]) => void;
}
export default ({ options, onClick }: Props) => {
  const [active, setActive] = useState(false);

  const onItemClick = (value: string) => {
    const split = value.split('_');
    if (split.length !== 2) {
      console.error('value格式錯誤');
      return;
    }
    onClick(split);
    setActive(false);
  };

  return (
    <EuiPopover
      ownFocus
      button={
        <DropButtonWrapper onClick={() => setActive(prev => !prev)}>
          <EuiIcon type="arrowDown" color="#006BB4" />
        </DropButtonWrapper>
      }
      isOpen={active}
      closePopover={() => setActive(false)}
      anchorPosition="downRight"
    >
      <EuiListGroup flush>
        {(options ?? listItems).map(item => (
          <EuiListGroupItem
            onClick={() => onItemClick(item.value)}
            label={item.label}
            key={item.value}
          />
        ))}
      </EuiListGroup>
    </EuiPopover>
  );
};

const listItems = [
  { label: '10分鐘', value: '10_m' },
  { label: '30分鐘', value: '30_m' },
  { label: '1小時', value: '1_h' },
  { label: '12小時', value: '12_h' },
  { label: '24小時', value: '24_h' },
  { label: '1星期', value: '1_w' },
  { label: '1個月', value: '1_M' },
  { label: '3個月', value: '3_M' }
];
