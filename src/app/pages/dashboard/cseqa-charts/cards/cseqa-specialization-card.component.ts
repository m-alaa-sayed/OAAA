import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  DashboardCseqaSpecializationDistributionResponse,
  DashboardCseqaSpecializationDistributionRow
} from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { TranslateService } from '@ngx-translate/core';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-cseqa-specialization-card',
  templateUrl: './cseqa-specialization-card.component.html'
})
export class CseqaSpecializationCardComponent implements OnInit {
  categories: string[] = [];
  series: { name: string; data: number[] }[] = [];
  colors = ['#1E88E5', '#10B981', '#F4B400'];
  tableData: Array<DashboardCseqaSpecializationDistributionRow & { isTotalRow?: boolean }> = [];
  isExporting = false;

  columns: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private translate: TranslateService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
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
        cellStyle: { textAlign: 'center' },
        children: [
          {
            field: 'international',
            headerName: 'دولي',
            cellStyle: { textAlign: 'center' },
          }
        ],
      },
      { field: 'grandTotal', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
    ];
  }

  private load(): void {
    this.dashboardService.getCseqaSpecializationDistribution().subscribe({
      next: (response: DashboardCseqaSpecializationDistributionResponse) => {
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
        sourceSelector: 'app-cseqa-specialization-card',
        reportTitleKey: 'PAGES.DASHBOARD.CSEQA.LABELS.CARD_SPECIALIZATION_DISTRIBUTION',
        authorityTitleKey: 'MENUITEMS.MENU.CSEQA'
      });
    } finally {
      this.isExporting = false;
    }
  }

  async exportExcel(): Promise<void> {
    if (this.isExporting || !this.tableData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cseqa-specialization-distribution-${new Date().toISOString().slice(0, 10)}`,
        headers: this.columns.map((column) => column.headerName),
        rows: this.tableData.map((row) => [
          this.translate.currentLang === 'ar' ? row.nameAr : row.nameEn,
          row.omani,
          row.nonOmani,
          row.localTotal,
          row.international,
          row.grandTotal
        ]),
        filters: [],
        sheetName: this.translate.currentLang === 'ar' ? 'توزيع التخصصات' : 'Specialization Distribution'
      });
    } finally {
      this.isExporting = false;
    }
  }
}
