import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardOqfSpecializationDistributionResponse, DashboardOqfSpecializationDistributionRow } from 'src/app/core/models/dashboard-oqf-specialization-distribution.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';

@Component({
  selector: 'app-oqf-specialization-card',
  templateUrl: './oqf-specialization-card.component.html'
})
export class OqfSpecializationCardComponent implements OnInit {
  categories: string[] = [];
  series: { name: string; data: number[] }[] = [];
  colors = ['#1E88E5', '#10B981', '#F4B400'];
  tableData: Array<DashboardOqfSpecializationDistributionRow & { isTotalRow?: boolean }> = [];
  isExporting = false;

  columns: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private translate: TranslateService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.getColumns());
    this.load();
  }

  private getColumns(): any[] {
    return [
      { field: this.translate.currentLang === 'ar' ? 'nameAr' : 'nameEn', headerName: 'التخصص', cellStyle: { textAlign: 'center' } },
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
        children: [
          { field: 'international', headerName: 'دولي', cellStyle: { textAlign: 'center' } }
        ]
      },
      { field: 'grandTotal', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
    ];
  }

  private load(): void {
    this.dashboardService.getOqfSpecializationDistribution().subscribe({
      next: (response: DashboardOqfSpecializationDistributionResponse) => {
        const rows = response?.rows ?? [];
        this.categories = response?.chart?.categories ?? [];
        this.series = response?.chart?.series?.length
          ? this.helper.normalizeReviewerSeries(response.chart.series)
          : this.helper.buildReviewerSeriesFromRows(rows);

        const totals = response?.totals;
        this.tableData = totals
          ? [
            ...rows,
            {
              code: 'TOTAL',
              nameEn: 'Total',
              nameAr: 'الإجمالي',
              omani: totals.omani,
              nonOmani: totals.nonOmani,
              localTotal: totals.localTotal,
              international: totals.international,
              grandTotal: totals.grandTotal,
              isTotalRow: true
            }
          ]
          : rows;
      },
      error: () => {
        this.categories = [];
        this.series = [];
        this.tableData = [];
      }
    });
  }

  async exportPdf(): Promise<void> {
    if (this.isExporting || !this.tableData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-oqf-specialization-card',
        reportTitleKey: 'PAGES.DASHBOARD.OQF.LABELS.CARD_SPECIALIZATION_DISTRIBUTION',
        authorityTitleKey: 'MENUITEMS.MENU.OQF'
      });
    } finally {
      this.isExporting = false;
    }
  }
}
