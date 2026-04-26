import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CheqaDashboardHelperService {
  private readonly reviewerLabelKeys: string[] = [
    'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
    'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    'PAGES.DASHBOARD.COMMON.LABELS.REGION_1',
    'PAGES.DASHBOARD.COMMON.LABELS.REGION_2',
    'PAGES.DASHBOARD.COMMON.LABELS.REGION_3'
  ];

  private readonly statusAliasToLabelKey: Record<string, string> = {
    ACTIVE: 'PAGES.DASHBOARD.COMMON.LABELS.ACTIVE',
    IN_ACTIVE: 'PAGES.DASHBOARD.COMMON.LABELS.IN_ACTIVE',
    INACTIVE: 'PAGES.DASHBOARD.COMMON.LABELS.IN_ACTIVE',
    REMOVED: 'PAGES.DASHBOARD.COMMON.LABELS.REMOVED',
    WITHDRAW: 'PAGES.DASHBOARD.COMMON.LABELS.WITHDRAW',
    REJECTED: 'PAGES.DASHBOARD.COMMON.LABELS.REJECTED',
    AVAILABLE: 'PAGES.DASHBOARD.COMMON.LABELS.AVAILABLE',
    UNAVAILABLE: 'PAGES.DASHBOARD.COMMON.LABELS.UNAVAILABLE',
    SUBMITTED: 'PAGES.DASHBOARD.COMMON.LABELS.SUBMITTED',
    UNDER_REVIEW: 'PAGES.DASHBOARD.COMMON.LABELS.UNDER_REVIEW',
    APPROVED: 'PAGES.DASHBOARD.COMMON.LABELS.APPROVED',
    IN_PROGRESS: 'PAGES.DASHBOARD.COMMON.LABELS.IN_PROGRESS',
    RETURNED: 'PAGES.DASHBOARD.COMMON.LABELS.RETURNED',
  };

  private readonly gridHeaderKeyMap: Record<string, string> = {
    'النوع': 'PAGES.DASHBOARD.COMMON.LABELS.TYPE',
    'مراجع محلي': 'PAGES.DASHBOARD.COMMON.LABELS.LOCAL_REVIEWER',
    'عماني': 'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
    'غير عماني': 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    'مجموع محلي': 'PAGES.DASHBOARD.COMMON.LABELS.LOCAL_TOTAL',
    'مراجع دولي': 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL_REVIEWER',
    'المنطقة 1': 'PAGES.DASHBOARD.COMMON.LABELS.REGION_1',
    'المنطقة 2': 'PAGES.DASHBOARD.COMMON.LABELS.REGION_2',
    'المنطقة 3': 'PAGES.DASHBOARD.COMMON.LABELS.REGION_3',
    'مجموع دولي': 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL_TOTAL',
    'الإجمالي': 'PAGES.DASHBOARD.COMMON.LABELS.TOTAL',
    'الحالة': 'PAGES.DASHBOARD.COMMON.LABELS.STATUS',
    'التفصيل': 'PAGES.DASHBOARD.COMMON.LABELS.DETAIL',
    'الزيادة': 'PAGES.DASHBOARD.COMMON.LABELS.DIFFERENCE',
    'فرق %': 'PAGES.DASHBOARD.COMMON.LABELS.DIFFERENCE_PERCENT',
    'التخصص': 'PAGES.DASHBOARD.COMMON.LABELS.SPECIALIZATION',
    'الدولة': 'PAGES.DASHBOARD.COMMON.LABELS.COUNTRY',
    'عدد المراجعين': 'PAGES.DASHBOARD.COMMON.LABELS.REVIEWERS_COUNT',
    'نوع النشاط': 'PAGES.DASHBOARD.COMMON.LABELS.ACTIVITY_TYPE'
  };

  constructor(private translate: TranslateService) {}

  translateKey(key: string): string {
    return this.translate.instant(key);
  }

  getReviewerLabels(): string[] {
    return this.reviewerLabelKeys.map((key) => this.translate.instant(key));
  }

  buildReviewerSeriesFromRows(
    rows: Array<{ omani: number; nonOmani: number; intlR1: number; intlR2: number; intlR3: number }>
  ): Array<{ name: string; data: number[] }> {
    const [omaniLabel, nonOmaniLabel, region1Label, region2Label, region3Label] = this.getReviewerLabels();

    return [
      { name: omaniLabel, data: rows.map((item) => item.omani) },
      { name: nonOmaniLabel, data: rows.map((item) => item.nonOmani) },
      { name: region1Label, data: rows.map((item) => item.intlR1) },
      { name: region2Label, data: rows.map((item) => item.intlR2) },
      { name: region3Label, data: rows.map((item) => item.intlR3) }
    ];
  }

  getEmptyReviewerSeries(): Array<{ name: string; data: number[] }> {
    return this.buildReviewerSeriesFromRows([]);
  }

  getDefaultCountrySeries(): Array<{ name: string; data: number[] }> {
    return [
      {
        name: this.translate.instant('PAGES.DASHBOARD.COMMON.LABELS.REVIEWERS_COUNT'),
        data: []
      }
    ];
  }

  translateColumnHeaders(columns: any[]): any[] {
    return columns.map((column) => {
      const translatedColumn = { ...column };
      const key = translatedColumn.headerName ? this.gridHeaderKeyMap[translatedColumn.headerName] : null;

      if (key) {
        translatedColumn.headerName = this.translate.instant(key);
      }

      if (Array.isArray(translatedColumn.children)) {
        translatedColumn.children = this.translateColumnHeaders(translatedColumn.children);
      }

      return translatedColumn;
    });
  }

  getLocalizedValue(arValue?: string, enValue?: string): string {
    const currentLang = this.translate.currentLang || this.translate.defaultLang;
    const preferEnglish = currentLang?.toLowerCase().startsWith('en');

    if (preferEnglish) {
      return enValue || arValue || '';
    }

    return arValue || enValue || '';
  }

  mapStatusLabel(status: string): string {
    return this.statusAliasToLabelKey[status] ? this.translate.instant(this.statusAliasToLabelKey[status]) : status;
  }

  mapComparisonTypeLabel(type: string): string {
    const typeMap: Record<string, string> = {
      LOCAL: this.translate.instant('PAGES.DASHBOARD.CHEQA.LABELS.REVIEWER_TYPE_LOCAL'),
      INTERNATIONAL: this.translate.instant('PAGES.DASHBOARD.CHEQA.LABELS.REVIEWER_TYPE_INTERNATIONAL')
    };

    return typeMap[type] ?? type;
  }

  mapComparisonDetailLabel(detail: string): string {
    const detailMap: Record<string, string> = {
      OMANI: this.translate.instant('PAGES.DASHBOARD.COMMON.LABELS.OMANI'),
      NON_OMANI: this.translate.instant('PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI'),
      REGION_1: this.translate.instant('PAGES.DASHBOARD.COMMON.LABELS.REGION_1'),
      REGION_2: this.translate.instant('PAGES.DASHBOARD.COMMON.LABELS.REGION_2'),
      REGION_3: this.translate.instant('PAGES.DASHBOARD.COMMON.LABELS.REGION_3')
    };

    return detailMap[detail] ?? detail;
  }
}
