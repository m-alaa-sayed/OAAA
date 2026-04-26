import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppConstants } from 'src/app/core/constants/app-constants';

export interface PdfExportOptions {
  fileName: string;
  reportTitle: string;
  authorityTitle: string;
  exportedBy: string;
  exportedAt: Date;
  language: 'ar' | 'en';
  tableHeaders: string[];
  tableRows: Array<Array<string | number>>;
}

export interface DashboardPdfReportOptions {
  reportTitleKey: string;
  authorityTitleKey: string;
  tableHeaders: string[];
  tableRows: Array<Array<string | number>>;
  language?: 'ar' | 'en';
  fileNamePrefix?: string;
  exportedBy?: string;
  exportedAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class DashboardPdfExportService {
  private fontsPromise: Promise<{ regular: string; bold: string }> | null = null;

  constructor(private translate: TranslateService) {}

  async exportReport(options: DashboardPdfReportOptions): Promise<void> {
    const language = options.language ?? (this.translate.currentLang === 'ar' ? 'ar' : 'en');
    const reportTitle = this.translate.instant(options.reportTitleKey);
    const authorityTitle = this.translate.instant(options.authorityTitleKey);
    const exportedAt = options.exportedAt ?? new Date();
    const exportedBy = options.exportedBy ?? this.getCurrentUserName(language);

    await this.export({
      fileName: this.buildFileName(reportTitle, options.fileNamePrefix),
      reportTitle,
      authorityTitle,
      exportedBy,
      exportedAt,
      language,
      tableHeaders: options.tableHeaders,
      tableRows: options.tableRows
    });
  }

  async export(options: PdfExportOptions): Promise<void> {
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const isArabic = options.language === 'ar';

    await this.registerFonts(pdf);

    // Keep document text flow LTR and control Arabic layout via right alignment.
    // Enabling global R2L here can mirror mixed Arabic/number strings in jsPDF output.
    pdf.setR2L(false);

    pdf.setFont('Cairo');
    pdf.setDocumentProperties({
      title: options.reportTitle,
      subject: options.authorityTitle,
      author: options.exportedBy,
      creator: 'Velzon Dashboard PDF Export'
    });

    // 🟦 Header Background
    pdf.setFillColor(31, 79, 124);
    pdf.rect(0, 0, 210, 20, 'F');

    pdf.setTextColor(255);
    pdf.setFont('Cairo', 'bold');
    pdf.setFontSize(14);
    pdf.text(options.reportTitle, 105, 13, { align: 'center' });

    // 🟪 Info
    pdf.setTextColor(0);
    pdf.setFont('Cairo', 'normal');
    pdf.setFontSize(10);

    pdf.text(
      `${isArabic ? 'تاريخ:' : 'Date:'} ${this.formatDate(options.exportedAt, options.language)}`,
      isArabic ? 200 : 10,
      30,
      { align: isArabic ? 'right' : 'left' }
    );

    pdf.text(
      `${isArabic ? 'بواسطة:' : 'By:'} ${options.exportedBy}`,
      isArabic ? 200 : 10,
      37,
      { align: isArabic ? 'right' : 'left' }
    );

    // 🟩 Table
    autoTable(pdf, {
      head: [isArabic ? options.tableHeaders.map(h => this.normalizeArabicText(h)) : options.tableHeaders],
      body: isArabic ? options.tableRows.map(row => row.map(cell => this.normalizeArabicText(String(cell)))) : options.tableRows,
      startY: 45,
      theme: 'grid',

      styles: {
        font: 'Cairo',
        fontStyle: 'normal',
        fontSize: 10,
        cellPadding: 4,
        halign: isArabic ? 'right' : 'center',
        valign: 'middle',
        textColor: [33, 37, 41]
      },

      headStyles: {
        fillColor: [31, 79, 124],
        textColor: 255,
        fontStyle: 'bold',
        halign: isArabic ? 'right' : 'center'
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },

      columnStyles: {
        0: { halign: isArabic ? 'right' : 'left' }
      },

      didParseCell: (data) => {
        // ✅ bold للـ total row
        if (data.row.index === options.tableRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    // 🟨 Page Numbers
    const totalPages = pdf.getNumberOfPages();
    pdf.setFontSize(9);

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
    }

    pdf.save(options.fileName);
  }

  private async registerFonts(pdf: jsPDF): Promise<void> {
    const fonts = await this.loadFonts();

    pdf.addFileToVFS('Cairo-Regular.ttf', fonts.regular);
    pdf.addFont('Cairo-Regular.ttf', 'Cairo', 'normal');

    pdf.addFileToVFS('Cairo-Bold.ttf', fonts.bold);
    pdf.addFont('Cairo-Bold.ttf', 'Cairo', 'bold');
  }

  private loadFonts(): Promise<{ regular: string; bold: string }> {
    if (!this.fontsPromise) {
      this.fontsPromise = Promise.all([
        this.loadFontBase64('assets/fonts/Cairo-Regular.ttf'),
        this.loadFontBase64('assets/fonts/Cairo-Bold.ttf')
      ]).then(([regular, bold]) => ({ regular, bold }));
    }

    return this.fontsPromise;
  }

  private async loadFontBase64(path: string): Promise<string> {
    const response = await fetch(new URL(path, document.baseURI).toString());

    if (!response.ok) {
      throw new Error(`Unable to load font asset: ${path}`);
    }

    const buffer = await response.arrayBuffer();
    return this.arrayBufferToBase64(buffer);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';

    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }

    return btoa(binary);
  }

  private buildFileName(reportTitle: string, prefix?: string): string {
    const datePart = new Date().toISOString().slice(0, 10);
    const normalizedTitle = reportTitle
      .replace(/\s+/g, '-')
      .replace(/[\\/:*?"<>|]+/g, '')
      .slice(0, 80);

    const safePrefix = prefix?.trim().replace(/\s+/g, '-') || '';
    const baseName = safePrefix ? `${safePrefix}-${normalizedTitle}` : normalizedTitle;

    return `${baseName || 'dashboard-report'}-${datePart}.pdf`;
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

  private normalizeArabicText(text: string): string {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Professional Arabic normalization with comprehensive Unicode mapping
    // This ensures compatibility with limited-glyph fonts like Cairo
    
    // Step 1: Remove all combining marks and diacritics that Cairo font doesn't support
    let normalized = text.replace(/[\u064B-\u0652]/g, ''); // Remove fatha, damma, etc.
    normalized = normalized.replace(/[\u0640]/g, ''); // Remove tatweel (kashida)
    normalized = normalized.replace(/[\u200C-\u200E]/g, ''); // Remove zero-width characters

    // Step 2: Map Arabic Presentation Forms-A (FB50-FDFF) to base forms
    const presentationFormsA: Record<number, number> = {
      0xFB50: 0x0627, // ALEF WITH MADDA ISOLATED
      0xFB51: 0x0627, 0xFB52: 0x0627, 0xFB53: 0x0627,
      0xFB54: 0x0628, 0xFB55: 0x0628, 0xFB56: 0x0628, 0xFB57: 0x0628, // BEH
      0xFB58: 0x062A, 0xFB59: 0x062A, 0xFB5A: 0x062A, 0xFB5B: 0x062A, // TEH
      0xFB5C: 0x062B, 0xFB5D: 0x062B, 0xFB5E: 0x062B, 0xFB5F: 0x062B, // THEH
      0xFB60: 0x062C, 0xFB61: 0x062C, 0xFB62: 0x062C, 0xFB63: 0x062C, // JEEM
      0xFB64: 0x062D, 0xFB65: 0x062D, 0xFB66: 0x062D, 0xFB67: 0x062D, // HAH
      0xFB68: 0x062E, 0xFB69: 0x062E, 0xFB6A: 0x062E, 0xFB6B: 0x062E, // KHAH
      0xFB6C: 0x062F, 0xFB6D: 0x062F, // DAL
      0xFB6E: 0x0630, 0xFB6F: 0x0630, // THAL
      0xFB70: 0x0631, 0xFB71: 0x0631, // REH
      0xFB72: 0x0632, 0xFB73: 0x0632, // ZAIN
      0xFB74: 0x0633, 0xFB75: 0x0633, 0xFB76: 0x0633, 0xFB77: 0x0633, // SEEN
      0xFB78: 0x0634, 0xFB79: 0x0634, 0xFB7A: 0x0634, 0xFB7B: 0x0634, // SHEEN
      0xFB7C: 0x0635, 0xFB7D: 0x0635, 0xFB7E: 0x0635, 0xFB7F: 0x0635, // SAD
      0xFB80: 0x0636, 0xFB81: 0x0636, 0xFB82: 0x0636, 0xFB83: 0x0636, // DAD
      0xFB84: 0x0637, 0xFB85: 0x0637, 0xFB86: 0x0637, 0xFB87: 0x0637, // TAH
      0xFB88: 0x0638, 0xFB89: 0x0638, // ZAH
      0xFB8A: 0x0639, 0xFB8B: 0x0639, 0xFB8C: 0x0639, 0xFB8D: 0x0639, // AIN
      0xFB8E: 0x063A, 0xFB8F: 0x063A, 0xFB90: 0x063A, 0xFB91: 0x063A, // GHAIN
      0xFB92: 0x0641, 0xFB93: 0x0641, 0xFB94: 0x0641, 0xFB95: 0x0641, // FEH
      0xFB96: 0x0642, 0xFB97: 0x0642, 0xFB98: 0x0642, 0xFB99: 0x0642, // QAF
      0xFB9A: 0x0643, 0xFB9B: 0x0643, 0xFB9C: 0x0643, 0xFB9D: 0x0643, // KAF
      0xFB9E: 0x0644, 0xFB9F: 0x0644, 0xFBA0: 0x0644, 0xFBA1: 0x0644, // LAM
      0xFBA2: 0x0645, 0xFBA3: 0x0645, 0xFBA4: 0x0645, 0xFBA5: 0x0645, // MEEM
      0xFBA6: 0x0646, 0xFBA7: 0x0646, 0xFBA8: 0x0646, 0xFBA9: 0x0646, // NOON
      0xFBAA: 0x0647, 0xFBAB: 0x0647, 0xFBAC: 0x0647, 0xFBAD: 0x0647, // HEH
      0xFBAE: 0x0648, 0xFBAF: 0x0648, // WAW
      0xFBB0: 0x0649, 0xFBB1: 0x0649, // ALEF MAKSURA
      0xFBD3: 0x0644, 0xFBD4: 0x0644, 0xFBD5: 0x0644, 0xFBD6: 0x0644, // LAM-ALEF variations
      0xFBD7: 0x0644, 0xFBD8: 0x0644, 0xFBD9: 0x0644, 0xFBDA: 0x0644,
      0xFBDB: 0x0644, 0xFBDC: 0x0644, 0xFBDD: 0x0644, 0xFBDE: 0x0644,
      0xFBDF: 0x0644, 0xFBE0: 0x0644, 0xFBE1: 0x0644, 0xFBE2: 0x0644,
      0xFBE3: 0x0644, 0xFBE4: 0x0644,
    };

    // Step 3: Map Arabic Presentation Forms-B (FE70-FEFF) to base forms
    const presentationFormsB: Record<number, number> = {
      0xFE8E: 0x0628, 0xFE8F: 0x0628, 0xFE90: 0x0628, 0xFE91: 0x0628, // BEH
      0xFE92: 0x062A, 0xFE93: 0x062A, 0xFE94: 0x062A, 0xFE95: 0x062A, // TEH
      0xFE96: 0x062B, 0xFE97: 0x062B, 0xFE98: 0x062B, 0xFE99: 0x062B, // THEH
      0xFE9A: 0x062C, 0xFE9B: 0x062C, 0xFE9C: 0x062C, 0xFE9D: 0x062C, // JEEM
      0xFE9E: 0x062D, 0xFE9F: 0x062D, 0xFEA0: 0x062D, 0xFEA1: 0x062D, // HAH
      0xFEA2: 0x062E, 0xFEA3: 0x062E, 0xFEA4: 0x062E, 0xFEA5: 0x062E, // KHAH
      0xFEA6: 0x062F, 0xFEA7: 0x062F, // DAL
      0xFEA8: 0x0630, 0xFEA9: 0x0630, // THAL
      0xFEAA: 0x0631, 0xFEAB: 0x0631, // REH
      0xFEAC: 0x0632, 0xFEAD: 0x0632, // ZAIN
      0xFEAE: 0x0633, 0xFEAF: 0x0633, 0xFEB0: 0x0633, 0xFEB1: 0x0633, // SEEN
      0xFEB2: 0x0634, 0xFEB3: 0x0634, 0xFEB4: 0x0634, 0xFEB5: 0x0634, // SHEEN
      0xFEB6: 0x0635, 0xFEB7: 0x0635, 0xFEB8: 0x0635, 0xFEB9: 0x0635, // SAD
      0xFEBA: 0x0636, 0xFEBB: 0x0636, 0xFEBC: 0x0636, 0xFEBD: 0x0636, // DAD
      0xFEBE: 0x0637, 0xFEBF: 0x0637, 0xFEC0: 0x0637, 0xFEC1: 0x0637, // TAH
      0xFEC2: 0x0638, 0xFEC3: 0x0638, 0xFEC4: 0x0638, 0xFEC5: 0x0638, // ZAH
      0xFEC6: 0x0639, 0xFEC7: 0x0639, 0xFEC8: 0x0639, 0xFEC9: 0x0639, // AIN
      0xFECA: 0x063A, 0xFECB: 0x063A, 0xFECC: 0x063A, 0xFECD: 0x063A, // GHAIN
      0xFECE: 0x0641, 0xFECF: 0x0641, 0xFED0: 0x0641, 0xFED1: 0x0641, // FEH
      0xFED2: 0x0642, 0xFED3: 0x0642, 0xFED4: 0x0642, 0xFED5: 0x0642, // QAF
      0xFED6: 0x0643, 0xFED7: 0x0643, 0xFED8: 0x0643, 0xFED9: 0x0643, // KAF
      0xFEDA: 0x0644, 0xFEDB: 0x0644, 0xFEDC: 0x0644, 0xFEDD: 0x0644, // LAM
      0xFEDE: 0x0645, 0xFEDF: 0x0645, 0xFEE0: 0x0645, 0xFEE1: 0x0645, // MEEM
      0xFEE2: 0x0646, 0xFEE3: 0x0646, 0xFEE4: 0x0646, 0xFEE5: 0x0646, // NOON
      0xFEE6: 0x0647, 0xFEE7: 0x0647, 0xFEE8: 0x0647, 0xFEE9: 0x0647, // HEH
      0xFEEA: 0x0648, 0xFEEB: 0x0648, // WAW
      0xFEEC: 0x0649, 0xFEED: 0x0649, // ALEF MAKSURA
      0xFEEE: 0x064A, 0xFEEF: 0x064A, 0xFEF0: 0x064A, 0xFEF1: 0x064A, // YEH
    };

    // Apply presentation forms mapping
    let result = '';
    for (let i = 0; i < normalized.length; i++) {
      const code = normalized.charCodeAt(i);
      let mappedCode = presentationFormsA[code] || presentationFormsB[code] || code;
      result += String.fromCharCode(mappedCode);
    }

    return result;
  }
}

