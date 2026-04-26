import { Component, OnInit } from '@angular/core';
import { DashboardSpecializationDistributionResponse } from 'src/app/core/models/dashboard-specialization-distribution.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';

@Component({
  selector: 'app-cheqa-specialization-card',
  templateUrl: './cheqa-specialization-card.component.html'
})
export class CheqaSpecializationCardComponent implements OnInit {
  chartColors = ['#2D9CDB', '#2ECC71', '#F4B400', '#FF5B77', '#7E57C2'];
  categories: string[] = [];
  series: Array<{ name: string; data: number[] }> = [];
  tableData: any[] = [];

  columns = [
    { field: 'specialization', headerName: 'التخصص', cellStyle: { textAlign: 'center' } },
    {
      headerName: 'مراجع محلي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'omani', headerName: 'عماني', cellStyle: { textAlign: 'center' } },
        { field: 'nonOmani', headerName: 'غير عماني', cellStyle: { textAlign: 'center' } },
        { field: 'localTotal', headerName: 'مجموع محلي', cellStyle: { textAlign: 'center' } }
      ]
    },
    {
      headerName: 'مراجع دولي',
      cellStyle: { textAlign: 'center' },
      children: [
        { field: 'region1', headerName: 'المنطقة 1', cellStyle: { textAlign: 'center' } },
        { field: 'region2', headerName: 'المنطقة 2', cellStyle: { textAlign: 'center' } },
        { field: 'region3', headerName: 'المنطقة 3', cellStyle: { textAlign: 'center' } },
        { field: 'internationalTotal', headerName: 'مجموع دولي', cellStyle: { textAlign: 'center' } }
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
    this.dashboardService.getSpecializationDistribution().subscribe({
      next: (response: DashboardSpecializationDistributionResponse) => {
        const rows = response?.rows ?? [];
        this.categories = rows.map((item) => this.helper.getLocalizedValue(item.nameAr, item.nameEn) || item.code);
        this.series = this.helper.buildReviewerSeriesFromRows(rows);
        this.tableData = rows.map((item) => ({
          specialization: this.helper.getLocalizedValue(item.nameAr, item.nameEn) || item.code,
          omani: item.omani,
          nonOmani: item.nonOmani,
          localTotal: item.localTotal,
          region1: item.intlR1,
          region2: item.intlR2,
          region3: item.intlR3,
          internationalTotal: item.intlTotal,
          total: item.grandTotal
        }));

        if (response?.totals) {
          this.tableData.push({
            specialization: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TOTAL'),
            omani: response.totals.omani,
            nonOmani: response.totals.nonOmani,
            localTotal: response.totals.localTotal,
            region1: response.totals.intlR1,
            region2: response.totals.intlR2,
            region3: response.totals.intlR3,
            internationalTotal: response.totals.intlTotal,
            total: response.totals.grandTotal
          });
        }
      },
      error: () => {
        this.categories = [];
        this.series = [];
        this.tableData = [];
      }
    });
  }
}
