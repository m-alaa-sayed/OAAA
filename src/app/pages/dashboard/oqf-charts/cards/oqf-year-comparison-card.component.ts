import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardOqfYearComparisonResponse } from 'src/app/core/models/dashboard-oqf-year-comparison.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-oqf-year-comparison-card',
  templateUrl: './oqf-year-comparison-card.component.html'
})
export class OqfYearComparisonCardComponent implements OnInit {
  previousYear = 2025;
  currentYear = 2026;
  reviewerType = '';
  region = '';

  yearOptions = [2026, 2025, 2024, 2023, 2022];
  reviewerTypeOptions = [
    { value: '', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REVIEWER_TYPE_ALL' },
    { value: 'LOCAL', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REVIEWER_TYPE_LOCAL' },
    { value: 'INTERNATIONAL', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REVIEWER_TYPE_INTERNATIONAL' }
  ];
  regionOptions = [
    { value: '', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REGION_ALL' },
    { value: 'REGION_1', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REGION_1' },
    { value: 'REGION_2', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REGION_2' },
    { value: 'REGION_3', labelKey: 'PAGES.DASHBOARD.OQF.LABELS.REGION_3' }
  ];

  series = [
    { name: String(this.previousYear), data: [] as number[] },
    { name: String(this.currentYear), data: [] as number[] }
  ];

  categories: string[] = [];
  colors = ['#1E88E5', '#10B981'];
  tableData: any[] = [];
  isExporting = false;

  columns = [
    { field: 'type', headerName: 'النوع', cellStyle: { textAlign: 'center' } },
    { field: 'detail', headerName: 'التفصيل', cellStyle: { textAlign: 'center' } },
    { field: 'previousYearCount', headerName: String(this.previousYear), cellStyle: { textAlign: 'center' } },
    { field: 'currentYearCount', headerName: String(this.currentYear), cellStyle: { textAlign: 'center' } },
    { field: 'difference', headerName: 'الفرق', cellStyle: { textAlign: 'center' } },
    {
      field: 'differencePercentage',
      headerName: 'فرق %',
      cellStyle: { textAlign: 'center', fontWeight: '700' },
      valueFormatter: (params: any) => params.value === null || params.value === undefined ? '-' : `${params.value}%`
    }
  ];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.load();
  }

  onPreviousYearChange(value: number): void {
    this.previousYear = Number(value);
    this.load();
  }

  onCurrentYearChange(value: number): void {
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
        sourceSelector: 'app-oqf-year-comparison-card',
        reportTitleKey: 'PAGES.DASHBOARD.OQF.LABELS.CARD_YEAR_COMPARISON',
        authorityTitleKey: 'MENUITEMS.MENU.OQF'
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
      const headers = this.translate.currentLang === 'ar'
        ? ['النوع', 'التفصيل', 'السابق', 'الحالي', 'الزيادة', 'فرق %']
        : ['Type', 'Detail', 'Previous', 'Current', 'Difference', 'Difference %'];
      const reviewerTypeLabel = this.reviewerTypeOptions.find((option) => option.value === this.reviewerType)?.labelKey;
      const regionLabel = this.regionOptions.find((option) => option.value === this.region)?.labelKey;
      const filters = [
        {
          label: this.translate.currentLang === 'ar' ? 'السنة السابقة' : 'Previous Year',
          value: this.previousYear
        },
        {
          label: this.translate.currentLang === 'ar' ? 'السنة الحالية' : 'Current Year',
          value: this.currentYear
        },
        {
          label: this.translate.currentLang === 'ar' ? 'نوع المراجع' : 'Reviewer Type',
          value: reviewerTypeLabel ? this.helper.translateKey(reviewerTypeLabel) : ''
        },
        {
          label: this.translate.currentLang === 'ar' ? 'المنطقة' : 'Region',
          value: regionLabel ? this.helper.translateKey(regionLabel) : ''
        }
      ];

      const rows = this.tableData.map((row) => [
        row.type,
        row.detail,
        row.previousYearCount,
        row.currentYearCount,
        row.difference,
        row.differencePercentage === null || row.differencePercentage === undefined ? '-' : `${row.differencePercentage}%`
      ]);

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `oqf-year-comparison-${new Date().toISOString().slice(0, 10)}`,
        headers,
        rows,
        filters,
        sheetName: this.translate.currentLang === 'ar' ? 'مقارنة الأعوام' : 'Year Comparison'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private load(): void {
    this.dashboardService
      .getOqfYearComparison(this.previousYear, this.currentYear, this.reviewerType || undefined, this.region || undefined)
      .pipe(finalize(() => this.updateYearHeaders()))
      .subscribe({
        next: (response: DashboardOqfYearComparisonResponse) => {
          const rows = response?.rows ?? [];
          this.tableData = rows.map((row) => ({
            ...row,
            type: this.helper.translateComparisonType(row.type),
            detail: this.helper.translateComparisonDetail(row.detail)
          }));
          this.categories = (response?.chart?.categories ?? []).map((category) => this.helper.translateComparisonDetail(category));
          this.series = [
            { name: String(this.previousYear), data: response?.chart?.series?.[0]?.data ?? [] },
            { name: String(this.currentYear), data: response?.chart?.series?.[1]?.data ?? [] }
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
      if (column.field === 'previousYearCount') {
        return { ...column, headerName: String(this.previousYear) };
      }
      if (column.field === 'currentYearCount') {
        return { ...column, headerName: String(this.currentYear) };
      }
      return column;
    });
  }
}
