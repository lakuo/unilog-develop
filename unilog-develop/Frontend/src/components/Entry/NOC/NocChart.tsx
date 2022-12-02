import React from 'react';
import { Axis, Chart, AreaSeries, ScaleType } from '@elastic/charts';
import { EuiBasicTable, EuiHealth, EuiPanel, EuiTitle } from '@elastic/eui';
import moment from 'moment';

interface Props {
  title: string;
  data: NocChartData[];
  unit?: string;
  fixed: number;
  domainX: { min: number; max: number };
  domainY?: { min: number; max: number };
}
export default function NocChart(props: Props) {
  const { title, data, unit, fixed, domainX, domainY } = props;

  return (
    <EuiPanel paddingSize="s">
      <EuiTitle size="xs">
        <h3>{title}</h3>
      </EuiTitle>
      <Chart size={{ height: 150 }}>
        {data.map(item => (
          <AreaSeries
            id={item.name}
            key={item.name}
            xScaleType={ScaleType.Time}
            yScaleType={ScaleType.Linear}
            xAccessor={'clock'}
            yAccessors={['value']}
            data={item.items}
            fit="average"
          />
        ))}
        <Axis
          id="bottom-axis"
          position="bottom"
          showGridLines
          labelFormat={(value: number) =>
            dateFormat(value, domainX.max, domainX.min)
          }
          tickFormat={(value: number) =>
            dateFormat(value, domainX.max, domainX.min)
          }
        />
        <Axis
          id="left-axis"
          position="left"
          showGridLines
          labelFormat={(value: string) => (unit ? value + unit : value)}
          tickFormat={(value: string) => (unit ? value + unit : value)}
          domain={domainY}
        />
      </Chart>
      <div style={{ padding: '0 20px 0 10px' }}>
        <EuiBasicTable
          className="noc-table"
          items={data}
          columns={[
            {
              name: '',
              render: (item: NocChartData) => (
                <EuiHealth color="#000">{item.name}</EuiHealth>
              )
            },
            {
              name: 'min',
              render: (item: NocChartData) => getMinValue(item, unit, fixed)
            },
            {
              name: 'max',
              render: (item: NocChartData) => getMaxValue(item, unit, fixed)
            },
            {
              name: 'avg',
              render: (item: NocChartData) => getAvgValue(item, unit, fixed)
            },
            {
              name: 'current',
              render: (item: NocChartData) => getCurrentValue(item, unit, fixed)
            },
            {
              name: 'total',
              render: (item: NocChartData) => item.items.length + '筆'
            }
          ]}
        />
      </div>
    </EuiPanel>
  );
}

function dateFormat(value: number, max: number, min: number) {
  return moment(value * 1000)
    .local()
    .format('M/D hh:mm');
}

function getMinValue(data: NocChartData, unit = '', fixed = 2) {
  let value = 0;
  if (data.items.length > 0) {
    value = Math.min(...data.items.map(item => Number(item.value)));
  }
  return value.toFixed(fixed) + unit;
}

function getMaxValue(data: NocChartData, unit = '', fixed = 2) {
  let value = 0;
  if (data.items.length > 0) {
    value = Math.max(...data.items.map(item => Number(item.value)));
  }
  return value.toFixed(fixed) + unit;
}

function getAvgValue(data: NocChartData, unit = '', fixed = 2) {
  let value = 0;
  if (data.items.length > 0) {
    value =
      data.items.map(item => Number(item.value)).reduce((a, b) => a + b) /
      data.items.length;
  }
  return value.toFixed(fixed) + unit;
}

function getCurrentValue(data: NocChartData, unit = '', fixed = 2) {
  let value = 0;
  if (data.items.length > 0) {
    value = Number(data.items[data.items.length - 1].value);
  }
  return value.toFixed(fixed) + unit;
}

export interface NocChartData {
  name: string;
  items: {
    clock: number;
    value: string;
  }[];
}
