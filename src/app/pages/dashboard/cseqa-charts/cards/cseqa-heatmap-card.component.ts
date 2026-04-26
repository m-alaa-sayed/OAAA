import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DashboardCseqaGovernorateWilayatDistributionResponse } from 'src/app/core/models/dashboard-cseqa.model';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { OqfDashboardHelperService } from '../../helpers/oqf-dashboard-helper.service';
import { HeatmapDataItem } from '../../components/heatmap-chart/heatmap-chart.component';
import { DashboardPrintExportService } from '../../helpers/dashboard-print-export.service';
import { CustomExcelExportService } from 'src/app/shared/report/services/custom-excel.service';

@Component({
  selector: 'app-cseqa-heatmap-card',
  templateUrl: './cseqa-heatmap-card.component.html'
})
export class CseqaHeatmapCardComponent implements OnInit {
  chartHeight = 360;

  heatmapData: HeatmapDataItem[] = [];
  isExporting = false;

  constructor(
    private dashboardService: DashboardService,
    private helper: OqfDashboardHelperService,
    private dashboardPrintExportService: DashboardPrintExportService,
    private customExcelExportService: CustomExcelExportService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.dashboardService.getCseqaDistributionByGovernorateWilayat().subscribe({
      next: (response: DashboardCseqaGovernorateWilayatDistributionResponse) => {
        const governorates = response?.governorates ?? [];

        this.heatmapData = governorates.flatMap((governorate) => {
          const group = this.helper.getLocalizedValue(governorate.governorateNameAr, governorate.governorateNameEn);
          const wilayats = governorate.wilayats ?? [];

          return wilayats.map((wilayat) => ({
            group,
            label: this.helper.getLocalizedValue(wilayat.wilayatNameAr, wilayat.wilayatNameEn),
            value: wilayat.count ?? 0
          }));
        });
      },
      error: () => {
        this.heatmapData = [];
      }
    });
  }

  async exportPdf(): Promise<void> {
    if (this.isExporting || !this.heatmapData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      await this.dashboardPrintExportService.printCard({
        sourceSelector: 'app-cseqa-heatmap-card',
        reportTitleKey: 'PAGES.DASHBOARD.CSEQA.LABELS.CARD_HEATMAP',
        authorityTitleKey: 'MENUITEMS.MENU.CSEQA'
      });
    } finally {
      this.isExporting = false;
    }
  }

  async exportExcel(): Promise<void> {
    if (this.isExporting || !this.heatmapData.length) {
      return;
    }

    this.isExporting = true;
    this.cdr.detectChanges();

    try {
      this.customExcelExportService.exportDashboardTableWithFilters({
        fileName: `cseqa-heatmap-${new Date().toISOString().slice(0, 10)}`,
        headers: ['Governorate', 'Wilayat', 'Count'],
        rows: this.heatmapData.map((item) => [item.group, item.label, item.value]),
        filters: [],
        sheetName: 'CSEQA Heatmap'
      });
    } finally {
      this.isExporting = false;
    }
  }
}
