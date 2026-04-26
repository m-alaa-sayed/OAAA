import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardCseqaActivitiesParticipationResponse } from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-cseqa-activities-card',
  templateUrl: './cseqa-activities-card.component.html'
})
export class CseqaActivitiesCardComponent implements OnInit {
  selectedYear: number | null = null;
  yearOptions = [
    { value: null, labelKey: 'PAGES.DASHBOARD.CSEQA.LABELS.ALL_YEARS' },
    { value: 2026, label: '2026' },
    { value: 2025, label: '2025' },
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' }
  ];

  donutLabels: string[] = [];
  donutColors = ['#1E88E5', '#10B981', '#F4B400'];
  donutCards: Array<{ title: string; series: number[]; total: number }> = [];
  isExporting = false;
  tableData: Array<{
    activityName: string;
    omani: number;
    nonOmani: number;
    international: number;
    total: number;
  }> = [];

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
    {headerName: 'مراجع دولي', children: [
      { field: 'international', headerName: 'دولي', cellStyle: { textAlign: 'center' } }
    ]},
    { field: 'total', headerName: 'الإجمالي', cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.donutLabels = this.helper.getReviewerLabels();
    this.load();
  }

  onYearChange(value: string): void {
    this.selectedYear = value ? Number(value) : null;
    this.load();
  }

  async exportPdf(): Promise<void> {
    if (this.isExporting || !this.tableData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-cseqa-activities-card',
        reportTitleKey: 'PAGES.DASHBOARD.CSEQA.LABELS.CARD_ACTIVITIES',
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
      const yearValue = this.selectedYear === null
        ? this.helper.translateKey('PAGES.DASHBOARD.CSEQA.LABELS.ALL_YEARS')
        : this.selectedYear;

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cseqa-activities-${new Date().toISOString().slice(0, 10)}`,
        headers: [
          this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.ACTIVITY_TYPE'),
          this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.OMANI'),
          this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI'),
          this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL'),
          this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TOTAL')
        ],
        rows: this.tableData.map((row) => [row.activityName, row.omani, row.nonOmani, row.international, row.total]),
        filters: [{ label: this.helper.translateKey('PAGES.DASHBOARD.CSEQA.LABELS.YEAR'), value: yearValue }],
        sheetName: 'CSEQA Activities'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private load(): void {
    this.dashboardService.getCseqaEqaActivitiesParticipation(this.selectedYear ?? undefined).subscribe({
      next: (response: DashboardCseqaActivitiesParticipationResponse) => {
        const rows = response?.rows ?? [];
        this.tableData = rows.map((item) => ({
          activityName: this.helper.getLocalizedValue(item.activityNameAr, item.activityNameEn),
          omani: item.omani,
          nonOmani: item.nonOmani,
          international: item.international,
          total: item.total
        }));

        this.donutCards = rows.map((item) => ({
          title: this.helper.getLocalizedValue(item.activityNameAr, item.activityNameEn),
          series: this.helper.buildReviewerSeriesFromRows([item]).map((seriesItem) => seriesItem.data[0] ?? 0),
          total: item.total
        }));
      },
      error: () => {
        this.tableData = [];
        this.donutCards = [];
      }
    });
  }
}
