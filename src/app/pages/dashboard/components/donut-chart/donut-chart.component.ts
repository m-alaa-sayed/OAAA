import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  standalone: false,
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss'
})
export class DonutChartComponent implements OnChanges {
  @Input() title: string = '';
  @Input() series: number[] = [];
  @Input() labels: string[] = [];
  @Input() colors: string[] = [];
  @Input() appendPercentToDataLabels: boolean = false;
  @Input() totalLabel: string = 'إجمالي';
  @Input() totalValue: number | null = null;
  @Input() height: number = 320;

  chartOptions: any;

  constructor() {
    this.initChart();
  }

  ngOnChanges(): void {
    this.initChart();
  }

  private initChart(): void {
    const series = [...(this.series || [])];

    this.chartOptions = {
      series,
      chart: {
        type: 'donut',
        height: this.height
      },
      labels: [...(this.labels || [])],
      colors: this.colors?.length ? this.colors : undefined,
      legend: {
        position: 'bottom'
      },
      dataLabels: {
        enabled: true,
        formatter: (_value: number, opts: any) => {
          const seriesValue = opts?.w?.config?.series?.[opts.seriesIndex];
          const suffix = this.appendPercentToDataLabels ? '%' : '';
          return `${seriesValue ?? 0}${suffix}`;
        },
        style: {
          colors: ['#000000']
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                color: '#000000'
              },
              value: {
                color: '#000000'
              },
              total: {
                show: true,
                label: this.totalLabel,
                color: '#000000',
                formatter: () => this.totalValue !== null
                  ? `${this.totalValue}`
                  : `${series.reduce((sum, value) => sum + Number(value || 0), 0)}`
              }
            }
          }
        }
      }
    };
  }
}
