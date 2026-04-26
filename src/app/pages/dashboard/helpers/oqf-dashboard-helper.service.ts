import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class OqfDashboardHelperService {
  private readonly reviewerLabelKeys: string[] = [
    'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
    'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL'
  ];

  private readonly reviewerAliasToLabelKey: Record<string, string> = {
    LOCAL_OMANI: 'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
    OMANI: 'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
    LOCAL_NON_OMANI: 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    LOCAL_NONOMANI: 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    NON_OMANI: 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    NONOMANI: 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    NON_OMANI_REVIEWER: 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    INTERNATIONAL: 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL',
    INTL: 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL',
    INTERNATIONAL_TOTAL: 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL'
  };

  private readonly statusAliasToLabelKey: Record<string, string> = {
    ACTIVE: 'PAGES.DASHBOARD.COMMON.LABELS.ACTIVE',
    IN_ACTIVE: 'PAGES.DASHBOARD.COMMON.LABELS.IN_ACTIVE',
    INACTIVE: 'PAGES.DASHBOARD.COMMON.LABELS.IN_ACTIVE',
    REMOVED: 'PAGES.DASHBOARD.COMMON.LABELS.REMOVED',
    WITHDRAW: 'PAGES.DASHBOARD.COMMON.LABELS.WITHDRAW',
    REJECTED: 'PAGES.DASHBOARD.COMMON.LABELS.REJECTED',
    AVAILABLE: 'PAGES.DASHBOARD.COMMON.LABELS.AVAILABLE',
    UNAVAILABLE: 'PAGES.DASHBOARD.COMMON.LABELS.UNAVAILABLE',
    UN_AVAILABLE: 'PAGES.DASHBOARD.COMMON.LABELS.UNAVAILABLE',
    SUBMITTED: 'PAGES.DASHBOARD.COMMON.LABELS.SUBMITTED',
    UNDER_REVIEW: 'PAGES.DASHBOARD.COMMON.LABELS.UNDER_REVIEW',
    APPROVED: 'PAGES.DASHBOARD.COMMON.LABELS.APPROVED',
    IN_PROGRESS: 'PAGES.DASHBOARD.COMMON.LABELS.IN_PROGRESS',
    RETURNED: 'PAGES.DASHBOARD.COMMON.LABELS.RETURNED',
  };

  private readonly gridHeaderKeyMap: Record<string, string> = {
    'النوع': 'PAGES.DASHBOARD.COMMON.LABELS.TYPE',
    'التفصيل': 'PAGES.DASHBOARD.COMMON.LABELS.DETAIL',
    'الفرق': 'PAGES.DASHBOARD.COMMON.LABELS.DIFFERENCE',
    'فرق %': 'PAGES.DASHBOARD.COMMON.LABELS.DIFFERENCE_PERCENT',
    'الدولة': 'PAGES.DASHBOARD.COMMON.LABELS.COUNTRY',
    'عدد المراجعين': 'PAGES.DASHBOARD.COMMON.LABELS.REVIEWERS_COUNT',
    'جهة العمل': 'PAGES.DASHBOARD.COMMON.LABELS.EMPLOYER',
    'المتدربين': 'PAGES.DASHBOARD.COMMON.LABELS.TRAINEES',
    'المجتازين التدريب': 'PAGES.DASHBOARD.COMMON.LABELS.PASSERS',
    'نوع النشاط': 'PAGES.DASHBOARD.COMMON.LABELS.ACTIVITY_TYPE',
    'مراجع خارجي محلي': 'PAGES.DASHBOARD.COMMON.LABELS.LOCAL_EXTERNAL_REVIEWER',
    'مراجع محلي': 'PAGES.DASHBOARD.COMMON.LABELS.LOCAL_REVIEWER',
    'عماني': 'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
    'غير عماني': 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
    'المجموع': 'PAGES.DASHBOARD.COMMON.LABELS.SUM',
    'مراجع خارجي دولي': 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL_EXTERNAL_REVIEWER',
    'مراجع دولي': 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL_REVIEWER',
    'الإجمالي': 'PAGES.DASHBOARD.COMMON.LABELS.TOTAL',
    'التخصص': 'PAGES.DASHBOARD.COMMON.LABELS.SPECIALIZATION',
    'الحالة': 'PAGES.DASHBOARD.COMMON.LABELS.STATUS',
    'دولي':'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL',
    'درجة التقييم':'PAGES.DASHBOARD.COMMON.LABELS.EVALUATION_RATING',
  };

  constructor(private translate: TranslateService) {}

  translateKey(key: string): string {
    return this.translate.instant(key);
  }

  getReviewerLabels(): string[] {
    return this.reviewerLabelKeys.map((key) => this.translate.instant(key));
  }

  normalizeReviewerLabel(rawLabel?: string): string {
    const normalized = this.normalizeToken(rawLabel);
    const labelKey = this.reviewerAliasToLabelKey[normalized];
    return labelKey ? this.translate.instant(labelKey) : rawLabel || '';
  }

  normalizeReviewerLabels(rawLabels?: string[]): string[] {
    if (!rawLabels?.length) {
      return this.getReviewerLabels();
    }

    return rawLabels.map((label) => this.normalizeReviewerLabel(label));
  }

  normalizeReviewerSeries(
    series?: Array<{ name: string; data: number[] }>
  ): Array<{ name: string; data: number[] }> {
    if (!series?.length) {
      return [];
    }

    return series.map((item) => ({
      name: this.normalizeReviewerLabel(item?.name),
      data: item?.data ?? []
    }));
  }

  translateStatusLabel(rawStatus?: string): string {
    const normalized = this.normalizeToken(rawStatus);
    const labelKey = this.statusAliasToLabelKey[normalized];
    return labelKey ? this.translate.instant(labelKey) : rawStatus || '';
  }

  translateEvaluationRating(rawRating?: string): string {
    const normalized = this.normalizeToken(rawRating);
    const ratingKeyMap: Record<string, string> = {
      EXCELLENT: 'PAGES.DASHBOARD.COMMON.LABELS.EXCELLENT',
      VERY_GOOD: 'PAGES.DASHBOARD.COMMON.LABELS.VERY_GOOD',
      GOOD: 'PAGES.DASHBOARD.COMMON.LABELS.GOOD',
      FAIR: 'PAGES.DASHBOARD.COMMON.LABELS.FAIR',
      WEAK: 'PAGES.DASHBOARD.COMMON.LABELS.WEAK',
    };

    const labelKey = ratingKeyMap[normalized];
    return labelKey ? this.translate.instant(labelKey) : rawRating || '';
  }

  buildReviewerSeriesFromRows(
    rows: Array<{ omani: number; nonOmani: number; international: number }>
  ): Array<{ name: string; data: number[] }> {
    const [omaniLabel, nonOmaniLabel, internationalLabel] = this.getReviewerLabels();

    return [
      { name: omaniLabel, data: rows.map((item) => item.omani) },
      { name: nonOmaniLabel, data: rows.map((item) => item.nonOmani) },
      { name: internationalLabel, data: rows.map((item) => item.international) }
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

  translateComparisonType(type?: string): string {
    const normalizedType = this.normalizeToken(type);

    if (normalizedType === 'LOCAL') {
      return this.translate.instant('PAGES.DASHBOARD.OQF.LABELS.REVIEWER_TYPE_LOCAL');
    }

    if (normalizedType === 'INTERNATIONAL') {
      return this.translate.instant('PAGES.DASHBOARD.OQF.LABELS.REVIEWER_TYPE_INTERNATIONAL');
    }

    return type || '';
  }

  translateComparisonDetail(detail?: string): string {
    const normalizedDetail = this.normalizeToken(detail);
    const detailKeyMap: Record<string, string> = {
      OMANI: 'PAGES.DASHBOARD.COMMON.LABELS.OMANI',
      NON_OMANI: 'PAGES.DASHBOARD.COMMON.LABELS.NON_OMANI',
      INTERNATIONAL: 'PAGES.DASHBOARD.COMMON.LABELS.INTERNATIONAL'
    };

    const detailKey = detailKeyMap[normalizedDetail];
    return detailKey ? this.translate.instant(detailKey) : detail || '';
  }

  private normalizeToken(rawValue?: string): string {
    return (rawValue || '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
}
