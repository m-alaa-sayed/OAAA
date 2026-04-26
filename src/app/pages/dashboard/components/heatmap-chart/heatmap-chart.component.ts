import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexTooltip
} from 'ng-apexcharts';

export type HeatmapDataItem = {
  group: string;
  label: string;
  value: number;
};

@Component({
  selector: 'app-heatmap-chart',
  templateUrl: './heatmap-chart.component.html'
})
export class HeatmapChartComponent implements OnChanges {

  @Input() data: HeatmapDataItem[] = [];
  @Input() height = 400;

  series: ApexAxisChartSeries = [];

  chart: ApexChart = {
    type: 'heatmap',
    height: this.height,
    toolbar: { show: false }
  };

  dataLabels: ApexDataLabels = {
    enabled: true,
    style: {
      colors: ['#000000']
    }
  };

  plotOptions: ApexPlotOptions = {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 4,
      distributed: true,
      colorScale: {
        ranges: [
          { from: 0, to: 10, color: '#dbeafe', name: 'Low' },
          { from: 11, to: 25, color: '#60a5fa', name: 'Medium' },
          { from: 26, to: 1000, color: '#1e3a8a', name: 'High' }
        ]
      }
    }
  };

  xaxis: ApexXAxis = {
    type: 'category',
    labels: {
      show: false
    }
  };

  tooltip: ApexTooltip = {
    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
      const group = w.config.series[seriesIndex].name;
      const label = w.config.series[seriesIndex].data[dataPointIndex].x;
      const value = series[seriesIndex][dataPointIndex];

      return `<div style="padding:10px">
        <b>${group}</b><br/>
        ${label}: ${value}
      </div>`;
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.transformData();
    }
  }

  private transformData() {
    const grouped: Record<string, any[]> = {};

    this.data.forEach(item => {
      if (!grouped[item.group]) {
        grouped[item.group] = [];
      }

      grouped[item.group].push({
        x: item.label,
        y: item.value
      });
    });

    this.series = Object.keys(grouped).map(key => ({
      name: key,
      data: grouped[key]
    }));
  }
}