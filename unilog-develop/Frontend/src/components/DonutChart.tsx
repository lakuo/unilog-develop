import React from 'react';
import {
  Chart,
  Settings,
  Partition,
} from '@elastic/charts';
import { ShapeTreeNode } from '@elastic/charts/dist/chart_types/partition_chart/layout/types/viewmodel_types';
import { EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';

export interface DataSchema {
  name: string;
  value: number;
}

interface PropSchema {
  data: DataSchema[];
  width?: number;
  height?: number;
}

export function DonutChart(props: PropSchema) {
  const euiChartTheme = EUI_CHARTS_THEME_LIGHT;

  return (
    <Chart size={{
      width: props.width,
      height: props.height,
    }}>
      <Settings
        showLegend
        legendMaxDepth={2} />
      <Partition
        id="fortigateOutDonut"
        data={props.data}
        valueAccessor={valueAccessor}
        layers={[
          {
            groupByRollup,
            shape: {
              fillColor,
            },
          },
        ]}
        config={{
          ...euiChartTheme.partition,
          emptySizeRatio: 0.4,
          clockwiseSectors: false,
        }}
      />
    </Chart>
  );
}
export default DonutChart;

function valueAccessor(data: DataSchema) {
  return data.value;
}

function groupByRollup(data: DataSchema) {
  return data.name;
}

const colors = [
  '#54B399',
  '#6092C0',
  '#9170B8',
  '#CA8EAE',
  '#D36086',
  '#E7664C',
  '#AA6556',
  '#DA8B45',
  '#B9A888',
  '#D6BF57',
];
function fillColor(data: ShapeTreeNode) {
  return colors[data.sortIndex];
}
