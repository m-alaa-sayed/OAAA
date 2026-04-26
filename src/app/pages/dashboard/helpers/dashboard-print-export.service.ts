import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'src/app/core/constants/app-constants';

export interface DashboardPrintCardOptions {
  sourceSelector: string;
  reportTitleKey: string;
  authorityTitleKey: string;
  exportedAt?: Date;
  exportedBy?: string;
  language?: 'ar' | 'en';
}

@Injectable({ providedIn: 'root' })
export class DashboardPrintExportService {
  private readonly activeClass = 'dashboard-print-root-active';

  constructor(private translate: TranslateService) {}

  async printCard(options: DashboardPrintCardOptions): Promise<void> {
    const source = document.querySelector(options.sourceSelector) as HTMLElement | null;

    if (!source) {
      throw new Error(`Print source not found: ${options.sourceSelector}`);
    }

    const language = options.language ?? (this.translate.currentLang === 'ar' ? 'ar' : 'en');
    const reportTitle = this.translate.instant(options.reportTitleKey);
    const authorityTitle = this.translate.instant(options.authorityTitleKey);
    const exportedAt = options.exportedAt ?? new Date();
    const exportedBy = options.exportedBy ?? this.getCurrentUserName(language);

    const printRoot = this.buildPrintRoot({ reportTitle, authorityTitle, exportedAt, exportedBy, language }, source);

    try {
      document.body.appendChild(printRoot);
      document.body.classList.add(this.activeClass);
      await this.waitForUiPaint();
      await this.waitForUiPaint();
      window.print();
    } finally {
      document.body.classList.remove(this.activeClass);
      printRoot.remove();
    }
  }

  private buildPrintRoot(
    details: {
      reportTitle: string;
      authorityTitle: string;
      exportedAt: Date;
      exportedBy: string;
      language: 'ar' | 'en';
    },
    source: HTMLElement
  ): HTMLElement {
    const root = document.createElement('div');
    root.className = 'dashboard-print-root';

    const cover = document.createElement('section');
    cover.className = 'dashboard-print-cover';
    cover.innerHTML = this.buildCoverMarkup(details);

    const content = document.createElement('section');
    content.className = 'dashboard-print-content';

    const clonedSource = source.cloneNode(true) as HTMLElement;
    this.prepareTableOnlyContent(clonedSource);
    content.appendChild(clonedSource);

    root.appendChild(cover);
    root.appendChild(content);

    return root;
  }

  private prepareTableOnlyContent(clonedSource: HTMLElement): void {
    this.isolateTableContent(clonedSource);

    const chartSelectors = [
      'app-bar-chart',
      'app-stacked-bar-chart',
      'app-grouped-bar-chart',
      'app-donut-chart',
      'apx-chart'
    ];

    clonedSource.querySelectorAll(chartSelectors.join(',')).forEach((chartNode) => {
      this.removeChartNode(chartNode as HTMLElement);
    });

    this.removeEmptyContainers(clonedSource);
  }

  private isolateTableContent(clonedSource: HTMLElement): void {
    const gridHost = clonedSource.querySelector('oaaaqa-ag-grid') as HTMLElement | null;
    const standaloneTable = clonedSource.querySelector(':scope > table, .card-body > table, table') as HTMLElement | null;

    const tableOnlyNode = gridHost ?? standaloneTable;

    if (!tableOnlyNode) {
      return;
    }

    const tableOnlyContainer = document.createElement('div');
    tableOnlyContainer.className = 'dashboard-print-table-only';
    tableOnlyContainer.appendChild(tableOnlyNode.cloneNode(true));

    clonedSource.innerHTML = '';
    clonedSource.appendChild(tableOnlyContainer);
  }

  private removeChartNode(chartNode: HTMLElement): void {
    if (chartNode.tagName === 'APP-DONUT-CHART') {
      const donutContainer = chartNode.closest('.col-12, .col-md-6, .col-xl-4, .col-lg-4, .col-sm-6, .col');

      if (donutContainer) {
        donutContainer.remove();
        return;
      }
    }

    chartNode.remove();
  }

  private removeEmptyContainers(root: HTMLElement): void {
    const removableSelectors = ['.row', '.card-body', '.card', '.col', '[class*="col-"]'];
    const nodes = Array.from(root.querySelectorAll(removableSelectors.join(',')));

    for (const node of nodes.reverse()) {
      const element = node as HTMLElement;
      const hasGrid = !!element.querySelector('oaaaqa-ag-grid, table');
      const hasMeaningfulText = (element.textContent ?? '').trim().length > 0;
      const hasChildren = element.children.length > 0;

      if (!hasGrid && !hasMeaningfulText && !hasChildren) {
        element.remove();
      }
    }
  }

  private buildCoverMarkup(details: {
    reportTitle: string;
    authorityTitle: string;
    exportedAt: Date;
    exportedBy: string;
    language: 'ar' | 'en';
  }): string {
    const isArabic = details.language === 'ar';
    const reportDateLabel = isArabic ? 'تاريخ التقرير' : 'Report date';
    const exportedByLabel = isArabic ? 'مستخرج التقرير' : 'Exported by';
    const authorityLabel = isArabic ? 'الجهة' : 'Authority';

    return `
      <div class="dashboard-print-cover-top">
        <img class="dashboard-print-cover-logo" src="assets/images/jawda-images/logo.svg" alt="OAAAQA logo" />
      </div>
      <div class="dashboard-print-cover-main">
        <h1>${this.escapeHtml(details.reportTitle)}</h1>
        <p>${this.escapeHtml(details.authorityTitle)}</p>
      </div>
      <div class="dashboard-print-cover-meta">
        <p><strong>${reportDateLabel}:</strong> ${this.escapeHtml(this.formatDate(details.exportedAt, details.language))}</p>
        <p><strong>${exportedByLabel}:</strong> ${this.escapeHtml(details.exportedBy)}</p>
        <p><strong>${authorityLabel}:</strong> ${this.escapeHtml(details.authorityTitle)}</p>
      </div>
    `;
  }

  private async waitForUiPaint(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 0));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }

  private getCurrentUserName(language: 'ar' | 'en'): string {
    const rawUser = localStorage.getItem(AppConstants.PERSISTED_KEYS.CURRENT_USER);

    if (!rawUser) {
      return language === 'ar' ? 'غير معروف' : 'Unknown';
    }

    try {
      const user = JSON.parse(rawUser) as { fullNameAr?: string; fullNameEn?: string; username?: string };

      if (language === 'ar') {
        return user.fullNameAr || user.username || 'غير معروف';
      }

      return user.fullNameEn || user.username || 'Unknown';
    } catch {
      return language === 'ar' ? 'غير معروف' : 'Unknown';
    }
  }

  private formatDate(value: Date, language: 'ar' | 'en'): string {
    return value.toLocaleString(language === 'ar' ? 'ar-OM' : 'en-GB', {
      hour12: true,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
