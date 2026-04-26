import { Component, Input, OnChanges } from "@angular/core";

@Component({
  selector: 'app-grouped-bar-chart',
  standalone: false,
  templateUrl: './grouped-bar-chart.component.html',
  styleUrl: './grouped-bar-chart.component.scss'
})
export class GroupedBarChartComponent implements OnChanges {
  @Input() series: any[] = [];
  @Input() categories: string[] = [];
  @Input() dataLabelsEnabled: boolean = false;
  @Input() colors: string[] = [];

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
        height: 400
      },
      xaxis: {
        categories: [...(this.categories || [])]
      },
      colors: this.colors.length ? this.colors : undefined,
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%"
        }
      },
      dataLabels: {
        enabled: this.dataLabelsEnabled
      },
      legend: {
        position: "top"
      }
    };
  }
}
