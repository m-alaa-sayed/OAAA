import { Component, OnInit } from '@angular/core';
import { DashboardCountsRatiosResponse } from 'src/app/core/models/dashboard-counts-ratios.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';

@Component({
  selector: 'app-cheqa-counts-ratios-card',
  templateUrl: './cheqa-counts-ratios-card.component.html'
})
export class CheqaCountsRatiosCardComponent implements OnInit {
  chartColors = ['#2D9CDB', '#2ECC71', '#F4B400', '#FF5B77', '#7E57C2'];
  chartLabels: string[] = [];
  tableData: any[] = [];
  donutSeries: number[] = [];

  columns = [
    { field: 'type', headerName: 'النوع', cellStyle: { textAlign: 'center' } },
    {
      headerName: 'مراجع محلي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'omani', headerName: 'عماني', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) },
        { field: 'nonOmani', headerName: 'غير عماني', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) },
        { field: 'localTotal', headerName: 'مجموع محلي', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) }
      ]
    },
    {
      headerName: 'مراجع دولي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'region1', headerName: 'المنطقة 1', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) },
        { field: 'region2', headerName: 'المنطقة 2', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) },
        { field: 'region3', headerName: 'المنطقة 3', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) },
        { field: 'internationalTotal', headerName: 'مجموع دولي', cellStyle: { textAlign: 'center' }, valueFormatter: (params: any) => this.formatValue(params) }
      ]
    },
    { field: 'total', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' }, valueFormatter: (params: any) => this.formatValue(params) }
  ];

  constructor(private dashboardService: DashboardService, private helper: CheqaDashboardHelperService) { }

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.chartLabels = [
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.OMANI'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_1'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_2'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_3')
    ];
    this.load();
  }

  private load(): void {
    this.dashboardService.getCountsRatios().subscribe({
      next: (response: DashboardCountsRatiosResponse) => {
        this.tableData = this.buildTableData(response);
        this.donutSeries = this.buildDonutSeries(response);
      },
      error: () => {
        this.tableData = [];
        this.donutSeries = [];
      }
    });
  }

  private buildTableData(response: DashboardCountsRatiosResponse): any[] {
    const local = response?.local;
    const international = response?.international;

    const omani = local?.omani;
    const nonOmani = local?.nonOmani;
    const localTotal = local?.total;
    const region1 = international?.region1;
    const region2 = international?.region2;
    const region3 = international?.region3;
    const internationalTotal = international?.total;
    const grandTotal = response?.grandTotal;

    return [
      {
        type: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.COUNT'),
        isPercentage: false,
        omani: omani?.count ?? 0,
        nonOmani: nonOmani?.count ?? 0,
        localTotal: localTotal?.count ?? 0,
        region1: region1?.count ?? 0,
        region2: region2?.count ?? 0,
        region3: region3?.count ?? 0,
        internationalTotal: internationalTotal?.count ?? 0,
        total: grandTotal?.count ?? 0
      },
      {
        type: `${this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.PERCENTAGE')} %`,
        isPercentage: true,
        omani: omani?.percentage ?? 0,
        nonOmani: nonOmani?.percentage ?? 0,
        localTotal: localTotal?.percentage ?? 0,
        region1: region1?.percentage ?? 0,
        region2: region2?.percentage ?? 0,
        region3: region3?.percentage ?? 0,
        internationalTotal: internationalTotal?.percentage ?? 0,
        total: grandTotal?.percentage ?? 0
      }
    ];
  }

  private buildDonutSeries(response: DashboardCountsRatiosResponse): number[] {
    const omani = response?.local?.omani;
    const nonOmani = response?.local?.nonOmani;
    const region1 = response?.international?.region1;
    const region2 = response?.international?.region2;
    const region3 = response?.international?.region3;

    return [
      omani?.percentage ?? 0,
      nonOmani?.percentage ?? 0,
      region1?.percentage ?? 0,
      region2?.percentage ?? 0,
      region3?.percentage ?? 0
    ];
  }

  private formatValue(params: any): string | number {
    if (params?.data?.isPercentage === true && params?.value !== null && params?.value !== undefined && params?.value !== '') {
      return `${params.value}%`;
    }

    return params?.value;
  }
}
