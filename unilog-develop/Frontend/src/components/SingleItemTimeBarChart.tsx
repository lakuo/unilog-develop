import React from 'react';
import {
  Chart,
  Settings,
  Axis,
  BarSeries,
  ScaleType,
  timeFormatter,
} from '@elastic/charts';

export interface DataSchema {
  time: number;
  value: number;
}

interface PropSchema {
  itemName: string;
  width?: number;
  height?: number;
  data: DataSchema[];
  timeFormat: string;
}
export function SingleItemTimeBarChart(props: PropSchema) {
  return (
    <Chart size={{
      width: props.width,
      height: props.height,
    }}>
      <Settings
        showLegend={true}
        legendPosition="right"/>
      <BarSeries
        id="status"
        name={props.itemName}
        data={props.data}
        xAccessor={'time'}
        yAccessors={['value']}
        xScaleType={ScaleType.Time} />
      <Axis
        id="bottom-axis"
        position="bottom"
        tickFormat={timeFormatter(props.timeFormat)}
        showGridLines />
      <Axis
        id="left-axis"
        position="left"
        showGridLines />
    </Chart>
  );
}
export default SingleItemTimeBarChart;
