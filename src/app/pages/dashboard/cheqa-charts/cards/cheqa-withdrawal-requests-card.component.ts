import { Component, OnInit } from '@angular/core';
import { DashboardWithdrawalRequestsResponse } from 'src/app/core/models/dashboard-withdrawal-requests.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';

@Component({
  selector: 'app-cheqa-withdrawal-requests-card',
  templateUrl: './cheqa-withdrawal-requests-card.component.html'
})
export class CheqaWithdrawalRequestsCardComponent implements OnInit {
  selectedYear: number | null = null;

  yearOptions = [
    { value: null, labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.ALL_YEARS' },
    { value: 2026, label: '2026' },
    { value: 2025, label: '2025' },
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' }
  ];

  columns = [
    { field: 'status', headerName: 'الحالة', cellStyle: { textAlign: 'center' } },
    {
      headerName: 'مراجع محلي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'omani', headerName: 'عماني', cellStyle: { textAlign: 'center' } },
        { field: 'nonOmani', headerName: 'غير عماني', cellStyle: { textAlign: 'center' } }
      ]
    },
    {
      headerName: 'مراجع دولي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'intlR1', headerName: 'المنطقة 1', cellStyle: { textAlign: 'center' } },
        { field: 'intlR2', headerName: 'المنطقة 2', cellStyle: { textAlign: 'center' } },
        { field: 'intlR3', headerName: 'المنطقة 3', cellStyle: { textAlign: 'center' } }
      ]
    },
    { field: 'total', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  dataList: any[] = [];
  chartCategories: string[] = [];
  chartSeries: Array<{ name: string; data: number[] }> = [];
  chartColors = ['#2D9CDB', '#2ECC71', '#F4B400', '#FF5B77', '#7E57C2'];

  constructor(private dashboardService: DashboardService, private helper: CheqaDashboardHelperService) {}

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.chartSeries = this.helper.getEmptyReviewerSeries();
    this.load();
  }

  onYearChange(value: number | null): void {
    this.selectedYear = value;
    this.load();
  }

  private load(): void {
    this.dashboardService.getWithdrawalRequestsByStatus(this.selectedYear ?? undefined).subscribe({
      next: (response: DashboardWithdrawalRequestsResponse) => {
        const rows = response?.rows ?? [];
        this.dataList = rows.map((item) => ({
          status: this.helper.mapStatusLabel(item.status),
          omani: item.omani,
          nonOmani: item.nonOmani,
          intlR1: item.intlR1,
          intlR2: item.intlR2,
          intlR3: item.intlR3,
          total: item.total
        }));
        this.chartCategories = rows.map((item) => this.helper.mapStatusLabel(item.status));
        this.chartSeries = this.helper.buildReviewerSeriesFromRows(rows);
      },
      error: () => {
        this.dataList = [];
        this.chartCategories = [];
        this.chartSeries = this.helper.getEmptyReviewerSeries();
      }
    });
  }
}
