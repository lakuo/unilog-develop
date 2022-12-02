import moment, { Moment, unitOfTime } from 'moment';
import { useCallback, useState } from 'react';

export function useNocTimeRange() {
  const [endTime, setEndTime] = useState<Moment>(moment());
  const [startTime, setStartTime] = useState<Moment>(
    endTime.clone().subtract(1, 'day')
  );
  const [range, setRange] = useState('1_d');
  const onChangeEnd = (time: Moment) => {
    const newUnix = time.unix();
    if (endTime.unix() !== newUnix) {
      setEndTime(time);
      if (startTime.unix() > newUnix) {
        setStartTime(moment(newUnix, 'X'));
      }
    }
    setRange('');
  };

  const onChangeStart = (time: Moment) => {
    const newUnix = time.unix();
    if (startTime.unix() !== newUnix) {
      setStartTime(time);
      if (newUnix > endTime.unix()) {
        setEndTime(moment(newUnix, 'X'));
      }
    }
    setRange('');
  };

  const onListItemClick = (value: string[]) => {
    updateTimeRange(value);
    setRange(value.join('_'));
  };

  const updateTimeRange = useCallback((value: string[]) => {
    const now = moment();
    setEndTime(now);
    setStartTime(
      now.clone().subtract(value[0], value[1] as unitOfTime.DurationConstructor)
    );
  }, []);

  const update = useCallback(() => {
    if (!range) return;
    const value = range.split('_');
    updateTimeRange(value);
  }, [range, updateTimeRange]);

  return {
    update: range ? update : undefined,
    timeRange: {
      startTime,
      onChangeStart,
      endTime,
      onChangeEnd,
      onListItemClick
    }
  };
}
