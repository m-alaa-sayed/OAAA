import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardYearComparisonItem } from 'src/app/core/models/dashboard-year-comparison.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { CheqaDashboardHelperService } from '../../helpers/cheqa-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cheqa-year-comparison-card',
  templateUrl: './cheqa-year-comparison-card.component.html'
})
export class CheqaYearComparisonCardComponent implements OnInit {
  previousYear = 2025;
  currentYear = 2026;
  reviewerType = 'ALL';
  region = '';

  yearOptions = [2026, 2025, 2024, 2023, 2022];
  reviewerTypeOptions = [
    { value: 'ALL', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REVIEWER_TYPE_ALL' },
    { value: 'LOCAL', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REVIEWER_TYPE_LOCAL' },
    { value: 'INTERNATIONAL', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REVIEWER_TYPE_INTERNATIONAL' }
  ];
  regionOptions = [
    { value: '', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REGION_ALL' },
    { value: 'REGION_1', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REGION_1' },
    { value: 'REGION_2', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REGION_2' },
    { value: 'REGION_3', labelKey: 'PAGES.DASHBOARD.CHEQA.LABELS.REGION_3' }
  ];

  series = [
    { name: String(this.previousYear), data: [] as number[] },
    { name: String(this.currentYear), data: [] as number[] }
  ];

  categories: string[] = [];
  chartColors = ['#2D9CDB', '#2ECC71'];
  tableData: any[] = [];
  isExporting = false;

  columns = [
    { field: 'type', headerName: 'النوع', cellStyle: { textAlign: 'center' } },
    { field: 'details', headerName: 'التفصيل', cellStyle: { textAlign: 'center' } },
    { field: 'value2024', headerName: '2024', cellStyle: { textAlign: 'center' } },
    { field: 'value2025', headerName: '2025', cellStyle: { textAlign: 'center' } },
    { field: 'increase', headerName: 'الزيادة', cellStyle: { textAlign: 'center' } },
    {
      field: 'differencePercent',
      headerName: 'فرق %',
      cellStyle: { textAlign: 'center', fontWeight: '700' },
      valueFormatter: (params: any) => params.value === null || params.value === undefined ? '-' : `${params.value}%`
    }
  ];

  constructor(
    private dashboardService: DashboardService,
    private helper: CheqaDashboardHelperService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.load();
  }

  onPreviousYearChange(value: string): void {
    this.previousYear = Number(value);
    this.load();
  }

  onCurrentYearChange(value: string): void {
    this.currentYear = Number(value);
    this.load();
  }

  onReviewerTypeChange(value: string): void {
    this.reviewerType = value;
    this.load();
  }

  onRegionChange(value: string): void {
    this.region = value;
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
        sourceSelector: 'app-cheqa-year-comparison-card',
        reportTitleKey: 'PAGES.DASHBOARD.CHEQA.LABELS.CARD_YEAR_COMPARISON',
        authorityTitleKey: 'MENUITEMS.MENU.CHEQA'
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
      const reviewerTypeLabel = this.reviewerTypeOptions.find((option) => option.value === this.reviewerType)?.labelKey;
      const regionLabel = this.regionOptions.find((option) => option.value === this.region)?.labelKey;

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cheqa-year-comparison-${new Date().toISOString().slice(0, 10)}`,
        headers: this.translate.currentLang === 'ar'
          ? ['النوع', 'التفصيل', 'السابق', 'الحالي', 'الزيادة', 'فرق %']
          : ['Type', 'Detail', 'Previous', 'Current', 'Difference', 'Difference %'],
        rows: this.buildTableRows(),
        filters: [
          { label: this.translate.currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year', value: this.previousYear },
          { label: this.translate.currentLang === 'ar' ? 'السنة الحالية' : 'Current Year', value: this.currentYear },
          { label: this.translate.currentLang === 'ar' ? 'نوع المراجع' : 'Reviewer Type', value: reviewerTypeLabel ? this.helper.translateKey(reviewerTypeLabel) : '' },
          { label: this.translate.currentLang === 'ar' ? 'المنطقة' : 'Region', value: regionLabel ? this.helper.translateKey(regionLabel) : '' }
        ],
        sheetName: 'CHEQA Year Comparison'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private buildTableRows(): Array<Array<string | number>> {
    return this.tableData.map((row) => [
      row.type,
      row.details,
      row.value2024,
      row.value2025,
      row.increase,
      row.differencePercent === null || row.differencePercent === undefined ? '-' : `${row.differencePercent}%`
    ]);
  }

  private load(): void {
    this.dashboardService
      .getYearComparison(this.previousYear, this.currentYear, this.reviewerType, this.region || undefined)
      .pipe(finalize(() => this.updateYearHeaders()))
      .subscribe({
        next: (response: DashboardYearComparisonItem[]) => {
          const rows = response ?? [];
          this.tableData = rows.map((item) => ({
            type: this.helper.mapComparisonTypeLabel(item.type),
            details: this.helper.mapComparisonDetailLabel(item.detail),
            value2024: item.previousYearCount,
            value2025: item.currentYearCount,
            increase: item.difference,
            differencePercent: item.differencePercentage
          }));
          this.categories = rows.map((item) => this.helper.mapComparisonDetailLabel(item.detail));
          this.series = [
            { name: String(this.previousYear), data: rows.map((item) => item.previousYearCount) },
            { name: String(this.currentYear), data: rows.map((item) => item.currentYearCount) }
          ];
        },
        error: () => {
          this.tableData = [];
          this.categories = [];
          this.series = [
            { name: String(this.previousYear), data: [] },
            { name: String(this.currentYear), data: [] }
          ];
        }
      });
  }

  private updateYearHeaders(): void {
    this.columns = this.columns.map((column) => {
      if (column.field === 'value2024') {
        return { ...column, headerName: String(this.previousYear) };
      }

      if (column.field === 'value2025') {
        return { ...column, headerName: String(this.currentYear) };
      }

      return column;
    });
  }
}
