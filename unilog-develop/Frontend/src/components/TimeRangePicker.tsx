import React, { CSSProperties, useState } from 'react';
import moment, { Moment, unitOfTime } from 'moment';
import 'moment/locale/zh-cn';
import { EuiDatePickerRange, EuiDatePicker } from '@elastic/eui';
import TimePickerDropButton from './TimePickerDropButton';

interface onChangeHandler {
  (date: Moment): void;
}

interface PropSchema {
  startTime: Moment;
  onChangeStart: onChangeHandler;
  endTime: Moment;
  onChangeEnd: onChangeHandler;
  onListItemClick: (value: string[]) => void;
  hideListBtn?: boolean;
  style?: CSSProperties;
}
export function TimeRangePicker(props: PropSchema) {
  const {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick,
    hideListBtn,
    style
  } = props;

  return (
    <div style={{ display: 'flex', ...style }}>
      <EuiDatePickerRange
        iconType=""
        startDateControl={
          <EuiDatePicker
            dateFormat="YYYY/MM/DD hh:mm A"
            selected={startTime}
            onChange={onChangeStart}
            startDate={startTime}
            endDate={endTime}
            isInvalid={startTime.unix() > endTime.unix()}
            aria-label="起始時間"
            showTimeSelect
            locale="zh-cn"
          />
        }
        endDateControl={
          <EuiDatePicker
            dateFormat="YYYY/MM/DD hh:mm A"
            selected={endTime}
            onChange={onChangeEnd}
            startDate={startTime}
            endDate={endTime}
            isInvalid={startTime.unix() > endTime.unix()}
            aria-label="結束時間"
            showTimeSelect
            locale="zh-cn"
          />
        }
      />
      {!hideListBtn && <TimePickerDropButton onClick={onListItemClick} />}
    </div>
  );
}
export default TimeRangePicker;

export function useTimeRangePicker() {
  const [endTime, setEndTime] = useState<Moment>(moment());
  const [startTime, setStartTime] = useState<Moment>(
    endTime.clone().subtract(1, 'day')
  );

  const onChangeEnd: onChangeHandler = time => {
    const newUnix = time.unix();
    if (endTime.unix() !== newUnix) {
      setEndTime(time);
      if (startTime.unix() > newUnix) {
        setStartTime(moment(newUnix, 'X'));
      }
    }
  };

  const onChangeStart: onChangeHandler = time => {
    const newUnix = time.unix();
    if (startTime.unix() !== newUnix) {
      setStartTime(time);
      if (newUnix > endTime.unix()) {
        setEndTime(moment(newUnix, 'X'));
      }
    }
  };

  const onListItemClick = (value: string[]) => {
    const now = moment();
    setEndTime(now);
    setStartTime(
      now.clone().subtract(value[0], value[1] as unitOfTime.DurationConstructor)
    );
  };

  return {
    startTime,
    onChangeStart,
    endTime,
    onChangeEnd,
    onListItemClick
  };
}
