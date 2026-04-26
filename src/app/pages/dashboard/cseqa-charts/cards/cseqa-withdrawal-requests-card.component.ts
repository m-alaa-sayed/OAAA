import { Component, OnInit } from '@angular/core';
import { DashboardCseqaWithdrawalRequestsByStatusResponse } from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';

@Component({
  selector: 'app-cseqa-withdrawal-requests-card',
  templateUrl: './cseqa-withdrawal-requests-card.component.html'
})
export class CseqaWithdrawalRequestsCardComponent implements OnInit {
  selectedYear: number | null = null;

  yearOptions = [
    { value: null, labelKey: 'PAGES.DASHBOARD.CSEQA.LABELS.ALL_YEARS' },
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
        { field: 'omani', headerName: 'عماني',  cellStyle: { textAlign: 'center' } },
        { field: 'nonOmani', headerName: 'غير عماني',  cellStyle: { textAlign: 'center' } },
        { field: 'localTotal', headerName: 'المجموع',  cellStyle: { textAlign: 'center' } }
      ]
    },
    {
      headerName: 'مراجع دولي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'international', headerName: 'دولي',  cellStyle: { textAlign: 'center' } }
      ]
    },
    { field: 'total', headerName: 'الإجمالي',  cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  dataList: any[] = [];
  chartCategories: string[] = [];
  chartSeries: Array<{ name: string; data: number[] }> = [];
  chartColors = ['#2D9CDB', '#2ECC71', '#F4B400', '#FF5B77', '#7E57C2'];

  constructor(private dashboardService: DashboardService, private helper: OqfDashboardHelperService) {}

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
    this.dashboardService.getCseqaWithdrawalRequestsByStatus(this.selectedYear ?? undefined).subscribe({
      next: (response: DashboardCseqaWithdrawalRequestsByStatusResponse) => {
        const rows = response?.rows ?? [];
        this.dataList = rows.map((item) => ({
          status: this.helper.translateStatusLabel(item.status),
          omani: item.omani,
          nonOmani: item.nonOmani,
          localTotal: item.localTotal,
          international: item.international,
          total: item.total
        }));
        this.chartCategories = (response?.chart?.categories ?? rows.map((item) => item.status))
          .map((status) => this.helper.translateStatusLabel(status));
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
