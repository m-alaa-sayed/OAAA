import { Component, OnInit } from '@angular/core';
import { DashboardOqfCountsRatiosTableRow } from 'src/app/core/models/dashboard-oqf-counts-ratios.model';
import { DashboardCseqaCountsRatiosResponse } from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';

@Component({
  selector: 'app-cseqa-counts-ratios-card',
  templateUrl: './cseqa-counts-ratios-card.component.html'
})
export class CseqaCountsRatiosCardComponent implements OnInit {
  countsRatiosLabels: string[] = [];
  countsRatiosSeries: number[] = [];
  chartColors = ['#1E88E5', '#10B981', '#F4B400'];
  chartLabels: string[] = [];
  countsRatiosTableData: any[] = [];
  appendPercentToDataLabels = true;

  countsRatiosColumns = [
    {
      field: 'type',
      headerName: 'النوع',
      cellStyle: { textAlign: 'center' }
    },
    {
      headerName: 'مراجع محلي',
      cellStyle: { textAlign: 'center' },
      children: [
        {
          field: 'omani',
          headerName: 'عماني',
          cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => this.formatPercentageRowValue(params)
        },
        {
          field: 'nonOmani',
          headerName: 'غير عماني',
          cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => this.formatPercentageRowValue(params)
        },
        {
          field: 'localTotal',
          headerName: 'المجموع',
          cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => this.formatPercentageRowValue(params)
        }
      ]
    },
    {
      headerName: 'مراجع دولي',
      cellStyle: { textAlign: 'center' },
      children: [
        {
          field: 'international',
          headerName: 'دولي',
          cellStyle: { textAlign: 'center' },
          valueFormatter: (params: any) => this.formatPercentageRowValue(params)
        }
      ],
    },
    {
      field: 'total',
      headerName: 'الإجمالي',
      cellStyle: { textAlign: 'center', fontWeight: '700' },
      valueFormatter: (params: any) => this.formatPercentageRowValue(params)
    }
  ];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService
  ) { }

  ngOnInit(): void {
    this.chartLabels = this.helper.getReviewerLabels();
    this.countsRatiosColumns = this.helper.translateColumnHeaders(this.countsRatiosColumns);
    this.load();
  }

  private load(): void {
    this.dashboardService.getCseqaCountsRatios().subscribe({
      next: (response: DashboardCseqaCountsRatiosResponse) => {
        this.chartLabels = this.helper.normalizeReviewerLabels(response?.chart?.categories);
        this.countsRatiosLabels = this.chartLabels;
        this.countsRatiosSeries = response?.chart?.series?.[0]?.data ?? this.buildDonutSeries(response);
        this.countsRatiosTableData = this.buildTableData(response);
      },
      error: () => {
        this.countsRatiosLabels = [];
        this.countsRatiosSeries = [];
        this.countsRatiosTableData = [];
      }
    });
  }

  private buildTableData(
    response: DashboardCseqaCountsRatiosResponse
  ): Array<DashboardOqfCountsRatiosTableRow & { isPercentage?: boolean }> {
    if (!response?.local || !response?.international || !response?.grandTotal) {
      return [];
    }

    return [
      {
        type: 'PAGES.DASHBOARD.COMMON.LABELS.COUNT',
        isPercentage: false,
        omani: response.local.omani.count,
        nonOmani: response.local.nonOmani.count,
        localTotal: response.local.total.count,
        international: response.international.total.count,
        total: response.grandTotal.count
      },
      {
        type: 'PAGES.DASHBOARD.COMMON.LABELS.PERCENTAGE',
        isPercentage: true,
        omani: response.local.omani.percentage,
        nonOmani: response.local.nonOmani.percentage,
        localTotal: response.local.total.percentage,
        international: response.international.total.percentage,
        total: response.grandTotal.percentage
      }
    ].map((item) => ({
      ...item,
      type: item.isPercentage ? `${this.helper.translateKey(item.type)} %` : this.helper.translateKey(item.type)
    }));
  }

  private buildDonutSeries(response: DashboardCseqaCountsRatiosResponse): number[] {
    return [
      response?.local?.omani?.percentage ?? 0,
      response?.local?.nonOmani?.percentage ?? 0,
      response?.international?.total?.percentage ?? 0
    ];
  }

  private formatPercentageRowValue(params: any): string | number {
    const isPercentageType = params?.data?.isPercentage === true;
    const hasValue = params?.value !== null && params?.value !== undefined && params?.value !== '';

    if (isPercentageType && hasValue) {
      return `${params.value}%`;
    }

    return params?.value;
  }
}
