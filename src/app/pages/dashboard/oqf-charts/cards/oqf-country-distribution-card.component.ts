import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardOqfCountryDistributionResponse } from 'src/app/core/models/dashboard-oqf-country-distribution.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-oqf-country-distribution-card',
  templateUrl: './oqf-country-distribution-card.component.html'
})
export class OqfCountryDistributionCardComponent implements OnInit {
  page = 0;
  pageSize = 10;
  pageSizeOptions = [10, 25, 50];
  sortDirection = 'DESC';

  categories: string[] = [];
  series: Array<{ name: string; data: number[] }> = [];
  colors = ['#1E88E5'];
  tableData: Array<{ countryName: string; count: number }> = [];
  isExporting = false;

  columns = [
    { field: 'countryName', headerName: 'الدولة', cellStyle: { textAlign: 'center' } },
    { field: 'count', headerName: 'عدد المراجعين', cellStyle: { textAlign: 'center' } }
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
    this.series = this.helper.getDefaultCountrySeries();
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

  async exportPdf(): Promise<void> {
    if (this.isExporting || !this.tableData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-oqf-country-distribution-card',
        reportTitleKey: 'PAGES.DASHBOARD.OQF.LABELS.CARD_COUNTRY_DISTRIBUTION',
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
      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `oqf-country-distribution-${new Date().toISOString().slice(0, 10)}`,
        headers: this.columns.map((column) => column.headerName),
        rows: this.tableData.map((row) => [row.countryName, row.count]),
        filters: [
          { label: 'Page', value: this.page + 1 },
          { label: 'Page Size', value: this.pageSize }
        ],
        sheetName: 'OQF Country Distribution'
      });
    } finally {
      this.isExporting = false;
    }
  }

  private load(): void {
    this.dashboardService.getOqfCountryDistribution(this.page, this.pageSize, this.sortDirection).subscribe({
      next: (response: DashboardOqfCountryDistributionResponse) => {
        const rows = response?.rows ?? [];
        this.tableData = rows.map((item) => ({
          countryName: item.countryNameAr || item.countryNameEn || '',
          count: item.count
        }));
        this.categories = response?.chart?.categories ?? this.tableData.map((item) => item.countryName);
        this.series = response?.chart?.series?.length
          ? response.chart.series
          : [{ name: this.helper.translateKey('PAGES.DASHBOARD.COMMON.LABELS.REVIEWERS_COUNT'), data: this.tableData.map((item) => item.count) }];
      },
      error: () => {
        this.tableData = [];
        this.categories = [];
        this.series = this.helper.getDefaultCountrySeries();
      }
    });
  }
}
