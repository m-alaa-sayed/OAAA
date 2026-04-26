import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardJoinRequestsResponse } from 'src/app/core/models/dashboard-join-requests.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-cheqa-join-requests-card',
  templateUrl: './cheqa-join-requests-card.component.html'
})
export class CheqaJoinRequestsCardComponent implements OnInit {
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
  isExporting = false;

  constructor(
    private dashboardService: DashboardService,
    private helper: CheqaDashboardHelperService,
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
        sourceSelector: 'app-cheqa-join-requests-card',
        reportTitleKey: 'PAGES.DASHBOARD.CHEQA.LABELS.CARD_JOIN_REQUESTS',
        authorityTitleKey: 'MENUITEMS.MENU.CHEQA'
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
        ? this.helper.translateKey('PAGES.DASHBOARD.CHEQA.LABELS.ALL_YEARS')
        : this.selectedYear;

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cheqa-join-requests-${new Date().toISOString().slice(0, 10)}`,
        headers: this.buildTableHeaders(),
        rows: this.buildTableRows(),
        filters: [{ label: this.helper.translateKey('PAGES.DASHBOARD.CHEQA.LABELS.YEAR'), value: yearValue }],
        sheetName: 'CHEQA Join Requests'
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
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_1'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_2'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_3'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TOTAL')
    ];
  }

  private buildTableRows(): Array<Array<string | number>> {
    return this.dataList.map((row) => [row.status, row.omani, row.nonOmani, row.intlR1, row.intlR2, row.intlR3, row.total]);
  }

  private load(): void {
    this.dashboardService.getJoinRequestsByStatus(this.selectedYear ?? undefined).subscribe({
      next: (response: DashboardJoinRequestsResponse) => {
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
