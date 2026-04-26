import { Component, OnInit } from '@angular/core';
import {
  DashboardCseqaStatusDistributionItem,
  DashboardCseqaStatusDistributionResponse
} from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';

@Component({
  selector: 'app-cseqa-status-distribution-card',
  templateUrl: './cseqa-status-distribution-card.component.html'
})
export class CseqaStatusDistributionCardComponent implements OnInit {
  categories: string[] = [];
  series: Array<{ name: string; data: number[] }> = [];
  colors = ['#1E88E5', '#10B981', '#F4B400'];
  tableData: DashboardCseqaStatusDistributionItem[] = [];

  columns = [
    { field: 'status', headerName: 'الحالة', cellStyle: { textAlign: 'center' } },
    {
      headerName: 'مراجع محلي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'omani', headerName: 'عماني', cellStyle: { textAlign: 'center' } },
        { field: 'nonOmani', headerName: 'غير عماني', cellStyle: { textAlign: 'center' } },
        { field: 'localTotal', headerName: 'المجموع', cellStyle: { textAlign: 'center' } }
      ]
    },

    {
      headerName: 'مراجع دولي',
      cellStyle: { textAlign: 'center' },
      children: [
        {
          field: 'international',
          headerName: 'دولي',
          cellStyle: { textAlign: 'center'},
        }
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

  private load(): void {
    this.dashboardService.getCseqaStatusDistribution().subscribe({
      next: (response: DashboardCseqaStatusDistributionResponse) => {
        const rows = response?.rows ?? [];
        this.categories = (response?.chart?.categories ?? []).map((category) => this.helper.translateStatusLabel(category));
        this.series = this.helper.buildReviewerSeriesFromRows(rows);
        this.tableData = rows.map((row) => ({
          ...row,
          status: this.helper.translateStatusLabel(row.status)
        }));
      },
      error: () => {
        this.categories = [];
        this.series = this.helper.getEmptyReviewerSeries();
        this.tableData = [];
      }
    });
  }
}
