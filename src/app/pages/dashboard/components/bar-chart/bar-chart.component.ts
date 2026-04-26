import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  standalone: false,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnChanges {
  @Input() series: any[] = [
    {
      name: 'عدد المراجعين',
      data: [180, 65, 52, 41, 38, 29, 25, 20, 18, 15]
    }
  ];
  @Input() categories: string[] = [
    'Oman',
    'Egypt',
    'Saudi Arabia',
    'United Kingdom',
    'Jordan',
    'India',
    'Germany',
    'France',
    'Australia',
    'Canada'
  ];
  @Input() colors: string[] = ['#2D9CDB'];
  @Input() dataLabelsEnabled: boolean = true;
  @Input() horizontal: boolean = true;
  @Input() height: number = 380;

  chartOptions: any;

  constructor() {
    this.initChart();
  }

  ngOnChanges(): void {
    this.initChart();
  }

  private initChart(): void {
    const series = (this.series || []).map((item) => ({
      ...item,
      data: [...(item?.data || [])]
    }));

    this.chartOptions = {
      series,
      colors: this.colors?.length ? this.colors : undefined,
      chart: {
        type: 'bar',
        height: this.height,
        toolbar: {
          show: true
        }
      },
      xaxis: {
        categories: [...(this.categories || [])]
      },
      plotOptions: {
        bar: {
          horizontal: this.horizontal,
          borderRadius: 2,
          barHeight: this.horizontal ? '70%' : undefined
        }
      },
      dataLabels: {
        enabled: this.dataLabelsEnabled
      },
      legend: {
        show: false
      }
    };
  }
}
