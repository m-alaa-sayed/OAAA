import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardOqfEmployerDistributionResponse } from 'src/app/core/models/dashboard-oqf-employer-distribution.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-oqf-employer-distribution-card',
  templateUrl: './oqf-employer-distribution-card.component.html'
})
export class OqfEmployerDistributionCardComponent implements OnInit {
  page = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50];
  sortDirection = 'DESC';
  selectedYear: number | null = null;
  search = '';

  yearOptions = [
    { value: null, labelKey: 'PAGES.DASHBOARD.OQF.LABELS.ALL_YEARS' },
    { value: 2026, label: '2026' },
    { value: 2025, label: '2025' },
    { value: 2024, label: '2024' },
    { value: 2023, label: '2023' }
  ];

  categories: string[] = [];
  series: { name: string; data: number[] }[] = [];
  colors = ['#1E88E5', '#10B981'];
  tableData: Array<{ employerName: string; traineesCount: number; passersCount: number }> = [];
  isExporting = false;

  columns = [
    { field: 'employerName', headerName: 'جهة العمل', cellStyle: { textAlign: 'center' } },
    { field: 'traineesCount', headerName: 'المتدربين', cellStyle: { textAlign: 'center' } },
    { field: 'passersCount', headerName: 'المجتازين التدريب', cellStyle: { textAlign: 'center', fontWeight: '700' } }
  ];

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = this.helper.translateColumnHeaders(this.columns);
    this.load();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.load();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.load();
  }

  onYearChange(value: string): void {
    this.selectedYear = value ? Number(value) : null;
    this.page = 0;
    this.load();
  }

  onSearchChange(value: string): void {
    this.search = value;
  }

  onSearchSubmit(): void {
    this.page = 0;
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
        sourceSelector: 'app-oqf-employer-distribution-card',
        reportTitleKey: 'PAGES.DASHBOARD.OQF.LABELS.CARD_EMPLOYER_DISTRIBUTION',
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
      const selectedYearLabel = this.selectedYear === null
        ? this.helper.translateKey('PAGES.DASHBOARD.OQF.LABELS.ALL_YEARS')
        : this.selectedYear;

      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `oqf-employer-distribution-${new Date().toISOString().slice(0, 10)}`,
        headers: this.columns.map((column) => column.headerName),
        rows: this.tableData.map((row) => [row.employerName, row.traineesCount, row.passersCount]),
        filters: [
          { label: this.helper.translateKey('PAGES.DASHBOARD.OQF.LABELS.YEAR'), value: selectedYearLabel },
          { label: this.helper.translateKey('PAGES.DASHBOARD.OQF.LABELS.SEARCH_EMPLOYER'), value: this.search || '-' }
        ],
        sheetName: 'OQF Employer Distribution'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private load(): void {
    this.dashboardService
      .getOqfEmployerDistribution(this.page, this.pageSize, this.sortDirection, this.selectedYear ?? undefined, this.search || undefined)
      .subscribe({
        next: (response: DashboardOqfEmployerDistributionResponse) => {
          const rows = response?.rows ?? [];
          const traineesLabel = this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TRAINEES');
          const passersLabel = this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.PASSERS');

          this.tableData = rows.map((item) => ({
            employerName: this.helper.getLocalizedValue(item.employerNameAr, item.employerNameEn),
            traineesCount: item.traineesCount,
            passersCount: item.passersCount
          }));

          this.categories = this.tableData.map((item) => item.employerName);
          this.series = [
            { name: traineesLabel, data: response?.chart?.series?.[0]?.data ?? this.tableData.map((item) => item.traineesCount) },
            { name: passersLabel, data: response?.chart?.series?.[1]?.data ?? this.tableData.map((item) => item.passersCount) }
          ];
        },
        error: () => {
          const traineesLabel = this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.TRAINEES');
          const passersLabel = this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.PASSERS');
          this.tableData = [];
          this.categories = [];
          this.series = [{ name: traineesLabel, data: [] }, { name: passersLabel, data: [] }];
        }
      });
  }
}
