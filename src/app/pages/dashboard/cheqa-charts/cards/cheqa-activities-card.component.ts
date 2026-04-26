import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardEqaActivitiesResponse } from 'src/app/core/models/dashboard-eqa-activities.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-cheqa-activities-card',
  templateUrl: './cheqa-activities-card.component.html'
})
export class CheqaActivitiesCardComponent implements OnInit {
  selectedYear: number | '' = '';

  columns = [
    { field: 'activityName', headerName: 'نوع النشاط', cellStyle: { textAlign: 'center' } },
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
  donutLabels: string[] = [];
  donutColors = ['#1E88E5', '#10B981', '#F59E0B', '#F43F5E', '#7C3AED'];
  donutCards: Array<{ title: string; series: number[] }> = [];
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
    this.donutLabels = this.helper.getReviewerLabels();
    this.load();
  }

  onYearChange(value: number | null): void {
    this.selectedYear = value ?? '';
    this.load();
  }

  async exportPdf(): Promise<void> {
    // if (this.isExporting || !this.dataList.length) {
    //   return;
    // }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-cheqa-activities-card',
        reportTitleKey: 'PAGES.DASHBOARD.CHEQA.LABELS.CARD_QA_ACTIVITIES',
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
      const yearValue = this.selectedYear === ''
        ? this.helper.translateKey('PAGES.DASHBOARD.CHEQA.LABELS.ALL_YEARS')
        : this.selectedYear;

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cheqa-qa-activities-${new Date().toISOString().slice(0, 10)}`,
        headers: this.buildTableHeaders(),
        rows: this.buildTableRows(),
        filters: [{ label: this.helper.translateKey('PAGES.DASHBOARD.CHEQA.LABELS.YEAR'), value: yearValue }],
        sheetName: 'CHEQA Activities'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private buildTableHeaders(): string[] {
    return [
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.ACTIVITY_TYPE'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.OMANI'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_1'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_2'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REGION_3'),
      this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TOTAL')
    ];
  }

  private buildTableRows(): Array<Array<string | number>> {
    return this.dataList.map((row) => [
      row.activityName,
      row.omani,
      row.nonOmani,
      row.intlR1,
      row.intlR2,
      row.intlR3,
      row.total
    ]);
  }

  private load(): void {
    this.dashboardService.getEqaActivitiesParticipation(this.selectedYear || undefined).subscribe({
      next: (response: DashboardEqaActivitiesResponse) => {
        const rows = response?.rows ?? [];
        this.dataList = rows.map((item) => ({
          activityName: this.helper.getLocalizedValue(item.activityNameAr, item.activityNameEn) || item.activityIdentifier,
          omani: item.omani,
          nonOmani: item.nonOmani,
          intlR1: item.intlR1,
          intlR2: item.intlR2,
          intlR3: item.intlR3,
          total: item.total
        }));
        this.donutCards = rows.map((item) => ({
          title: this.helper.getLocalizedValue(item.activityNameAr, item.activityNameEn) || item.activityIdentifier,
          series: this.helper.buildReviewerSeriesFromRows([item]).map((seriesItem) => seriesItem.data[0] ?? 0)
        }));
      },
      error: () => {
        this.dataList = [];
        this.donutCards = [];
      }
    });
  }
}
