import { Component, OnInit } from '@angular/core';
import { DashboardStatusDistributionItem } from 'src/app/core/models/dashboard-status-distribution.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';

@Component({
  selector: 'app-cheqa-status-distribution-card',
  templateUrl: './cheqa-status-distribution-card.component.html'
})
export class CheqaStatusDistributionCardComponent implements OnInit {
  chartColors = ['#2D9CDB', '#2ECC71', '#F4B400', '#FF5B77', '#7E57C2'];
  categories: string[] = [];
  series: Array<{ name: string; data: number[] }> = [];
  tableData: any[] = [];

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
        { field: 'region1', headerName: 'المنطقة 1', cellStyle: { textAlign: 'center' } },
        { field: 'region2', headerName: 'المنطقة 2', cellStyle: { textAlign: 'center' } },
        { field: 'region3', headerName: 'المنطقة 3', cellStyle: { textAlign: 'center' } }
      ]
    },
    { field: 'total', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  constructor(private dashboardService: DashboardService, private helper: CheqaDashboardHelperService) {}

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.series = this.helper.getEmptyReviewerSeries();
    this.load();
  }

  private load(): void {
    this.dashboardService.getStatusDistribution().subscribe({
      next: (response: DashboardStatusDistributionItem[]) => {
        const rows = response ?? [];
        this.tableData = rows.map((item) => ({
          status: this.helper.mapStatusLabel(item.status),
          omani: item.omani,
          nonOmani: item.nonOmani,
          region1: item.intlR1,
          region2: item.intlR2,
          region3: item.intlR3,
          total: item.total
        }));
        this.categories = rows.map((item) => this.helper.mapStatusLabel(item.status));
        this.series = this.helper.buildReviewerSeriesFromRows(rows);
      },
      error: () => {
        this.categories = [];
        this.series = this.helper.getEmptyReviewerSeries();
        this.tableData = [];
      }
    });
  }
}
