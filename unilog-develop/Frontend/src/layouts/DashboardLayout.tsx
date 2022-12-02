import React from 'react';
import { EuiPageContentBody, EuiSpacer, EuiFormRow } from '@elastic/eui';
import { Moment } from 'moment';

import ContentLayout from './ContentLayout';
import TimeRangePicker from '../components/TimeRangePicker';

interface PropSchema {
  title: React.ReactNode;
  startTime: Moment;
  onChangeStart: React.Dispatch<Moment>;
  endTime: Moment;
  onChangeEnd: React.Dispatch<Moment>;
  onListItemClick: (value: string[]) => void;
  children: React.ReactNode;
}
export function DashboardLayout(props: PropSchema) {
  return (
    <ContentLayout title={props.title}>
      <EuiPageContentBody>
        <EuiFormRow label="時間起迄">
          <TimeRangePicker
            startTime={props.startTime}
            onChangeStart={props.onChangeStart}
            endTime={props.endTime}
            onChangeEnd={props.onChangeEnd}
            onListItemClick={props.onListItemClick}
          />
        </EuiFormRow>
        <EuiSpacer size="xl" />
        {props.children}
      </EuiPageContentBody>
    </ContentLayout>
  );
}
export default DashboardLayout;
