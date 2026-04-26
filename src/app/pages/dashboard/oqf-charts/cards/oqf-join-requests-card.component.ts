import { Component, OnInit } from '@angular/core';
import { DashboardOqfJoinRequestsResponse, DashboardOqfJoinRequestsRow } from 'src/app/core/models/dashboard-oqf-join-requests.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';

@Component({
  selector: 'app-oqf-join-requests-card',
  templateUrl: './oqf-join-requests-card.component.html'
})
export class OqfJoinRequestsCardComponent implements OnInit {
  selectedYear: number | null = null;
  yearOptions = [
    { value: null, labelKey: 'PAGES.DASHBOARD.OQF.LABELS.ALL_YEARS' },
    { value: 2026, label: '2026' },
    { value: 2025, label: '2025' },
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' }
  ];

  categories: string[] = [];
  series: Array<{ name: string; data: number[] }> = [];
  colors = ['#1E88E5', '#10B981', '#F4B400'];
  tableData: DashboardOqfJoinRequestsRow[] = [];

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
      children: [
        { field: 'international', headerName: 'دولي', cellStyle: { textAlign: 'center' } }
      ],
    },
    { field: 'total', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  constructor(private dashboardService: DashboardService, private helper: OqfDashboardHelperService) { }

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.series = this.helper.getEmptyReviewerSeries();
    this.load();
  }

  onYearChange(value: string): void {
    this.selectedYear = value ? Number(value) : null;
    this.load();
  }

  private load(): void {
    this.dashboardService.getOqfJoinRequestsByStatus(this.selectedYear ?? undefined).subscribe({
      next: (response: DashboardOqfJoinRequestsResponse) => {
        const rows = response?.rows ?? [];
        this.tableData = rows.map((row) => ({
          ...row,
          status: this.helper.translateStatusLabel(row.status)
        }));
        this.categories = (response?.chart?.categories ?? []).map((category) => this.helper.translateStatusLabel(category));
        this.series = this.helper.buildReviewerSeriesFromRows(rows);
      },
      error: () => {
        this.tableData = [];
        this.categories = [];
        this.series = this.helper.getEmptyReviewerSeries();
      }
    });
  }
}
