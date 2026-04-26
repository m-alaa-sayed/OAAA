import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardCseqaJoinRequestsByStatusResponse } from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-cseqa-join-requests-card',
  templateUrl: './cseqa-join-requests-card.component.html'
})
export class CseqaJoinRequestsCardComponent implements OnInit {
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
  isExporting = false;

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.chartSeries = this.helper.getEmptyReviewerSeries();
    this.load();
  }

  onYearChange(value: number | null): void {
    this.selectedYear = value;
    this.load();
  }

  async exportPdf(): Promise<void> {
    if (this.isExporting || !this.dataList.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-cseqa-join-requests-card',
        reportTitleKey: 'PAGES.DASHBOARD.CSEQA.LABELS.CARD_JOIN_REQUESTS',
        authorityTitleKey: 'MENUITEMS.MENU.CSEQA'
      });
    } finally {
      this.isExporting = false;
    }
  }

  async exportExcel(): Promise<void> {
    if (this.isExporting || !this.dataList.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      const yearValue = this.selectedYear === null
        ? this.helper.translateKey('PAGES.DASHBOARD.CSEQA.LABELS.ALL_YEARS')
        : this.selectedYear;

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cseqa-join-requests-${new Date().toISOString().slice(0, 10)}`,
        headers: this.buildTableHeaders(),
        rows: this.buildTableRows(),
        filters: [{ label: this.helper.translateKey('PAGES.DASHBOARD.CSEQA.LABELS.YEAR'), value: yearValue }],
        sheetName: 'CSEQA Join Requests'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private buildTableHeaders(): string[] {
    return [
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.STATUS'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.OMANI'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.SUM'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TOTAL')
    ];
  }

  private buildTableRows(): Array<Array<string | number>> {
    return this.dataList.map((row) => [row.status, row.omani, row.nonOmani, row.localTotal, row.international, row.total]);
  }

  private load(): void {
    this.dashboardService.getCseqaJoinRequestsByStatus(this.selectedYear ?? undefined).subscribe({
      next: (response: DashboardCseqaJoinRequestsByStatusResponse) => {
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
