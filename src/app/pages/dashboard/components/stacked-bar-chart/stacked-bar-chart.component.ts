import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: 'app-stacked-bar-chart',
  standalone: false,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrl: './stacked-bar-chart.component.scss'
})
export class StackedBarChartComponent implements OnChanges {
  @Input() series: any[] = [];
  @Input() categories: string[] = [];
  @Input() dataLabelsEnabled: boolean = false;
  @Input() colors: string[] = [];
  @Input() horizontal: boolean = false;

  chartOptions: any;

  constructor() {
    this.initChart();
  }

  ngOnChanges() {
    this.initChart();
  }

  initChart() {
    const series = (this.series || []).map((item) => ({
      ...item,
      data: [...(item?.data || [])]
    }));

    this.chartOptions = {
      series,
      chart: {
        type: "bar",
        height: 400,
        stacked: true
      },
      xaxis: {
        categories: [...(this.categories || [])]
      },
      colors: this.colors.length ? this.colors : undefined,
      plotOptions: {
        bar: {
          horizontal: this.horizontal
        }
      },
      legend: {
        position: "top"
      },
      dataLabels: {
        enabled: this.dataLabelsEnabled
      }
    };
  }
}
