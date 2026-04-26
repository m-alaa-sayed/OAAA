import {Injectable} from '@angular/core';
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {LanguageUtil} from "../../../core/util/language.util";

const EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

export interface DashboardExcelFilterItem {
    label: string;
    value: string | number;
}

export interface DashboardExcelLayoutOptions {
    fileName: string;
    headers: string[];
    rows: Array<Array<string | number>>;
    filters?: DashboardExcelFilterItem[];
    sheetName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CustomExcelExportService {

    DATA_ROW_HEIGHT = 25;

    public exportDashboardTableWithFilters(options: DashboardExcelLayoutOptions): void {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(options.sheetName || 'Sheet1');
        worksheet.views = [{rightToLeft: LanguageUtil.isArabic}];

        const filters = options.filters || [];
        const headerRowIndex = Math.max(7, 2 + filters.length + 1);
        const dataStartRowIndex = headerRowIndex + 1;

        // Filters title block
        worksheet.mergeCells(1, 1, 1, 2);
        const filtersTitleCell = worksheet.getCell(1, 1);
        filtersTitleCell.value = LanguageUtil.isArabic ? 'الفلاتر المختارة' : 'Selected Filters';
        filtersTitleCell.font = { bold: true, color: { argb: 'FF000000' } };
        filtersTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        filtersTitleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9E2F3' }
        };
        filtersTitleCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        filters.forEach((filter, index) => {
            const rowIndex = index + 2;
            const labelCell = worksheet.getCell(rowIndex, 1);
            const valueCell = worksheet.getCell(rowIndex, 2);

            labelCell.value = filter.label;
            valueCell.value = filter.value ?? '';

            labelCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFEDF2FA' }
            };

            [labelCell, valueCell].forEach((cell) => {
                cell.alignment = {
                    horizontal: LanguageUtil.isArabic ? 'right' : 'left',
                    vertical: 'middle',
                    wrapText: true
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Table header
        options.headers.forEach((header, index) => {
            const cell = worksheet.getCell(headerRowIndex, index + 1);
            cell.value = header;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1F487E' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Table rows
        options.rows.forEach((rowValues, rowIndex) => {
            const excelRowIndex = dataStartRowIndex + rowIndex;
            rowValues.forEach((value, colIndex) => {
                const cell = worksheet.getCell(excelRowIndex, colIndex + 1);
                cell.value = value;
                cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            worksheet.getRow(excelRowIndex).height = this.DATA_ROW_HEIGHT;
        });

        worksheet.getColumn(1).width = 24;
        worksheet.getColumn(2).width = 24;
        for (let index = 3; index <= options.headers.length; index++) {
            worksheet.getColumn(index).width = 14;
        }

        workbook.xlsx.writeBuffer().then(buffer => {
            const finalName = options.fileName.endsWith(EXCEL_EXTENSION) ? options.fileName : `${options.fileName}${EXCEL_EXTENSION}`;
            const blob = new Blob([buffer], {type: EXCEL_MIME_TYPE});
            saveAs(blob, finalName);
        });
    }

    /**
     * Export an array of objects to an Excel file.
     *
     * @param rows        Data rows (array of objects).
     * @param fileName    Filename to save as (without extension is ok).
     * @param fields      Optional list of object keys to use (and order them).
     *                    If omitted, all keys of the first row are used.
     * @param headers     Optional list of header labels (same length & order as fields).
     *                    If omitted or mismatched, the field names are used as header.
     */
    public exportToExcel(rows: object[], fileName: string, fields?: string[], headers?: string[]): void {
        if (!rows || !rows.length) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
        worksheet.views = [{rightToLeft: LanguageUtil.isArabic}];

        const allKeys = Object.keys(rows[0]);

        // Decide which keys (fields) to export
        const keys = (fields && fields.length) ? fields.filter(f => allKeys.includes(f)) : allKeys;

        // Decide header labels (fallback to keys if not provided or length mismatch)
        const headerLabels = headers && headers.length === keys.length ? headers : keys;

        // Header row
        const headerRow = worksheet.addRow(headerLabels);
        headerRow.eachCell({includeEmpty: true}, cell => {
            cell.font = {
                bold: true,
                color: {argb: 'FFFFFFFF'}
            };
            cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {argb: 'FF1F487E'}
            };
        });

        // Data rows
        rows.forEach(rowObj => {
            const rowValues = keys.map(k => {
                const value = (rowObj as any)[k];
                if (Array.isArray(value)) {
                    return value.join('\n');
                }
                return value;
            });

            const row = worksheet.addRow(rowValues);
            row.alignment = {horizontal: 'center', wrapText: true};
            row.height = this.DATA_ROW_HEIGHT;
        });

        // Auto column widths + wrap text
        worksheet.columns?.forEach(column => {
            if (!column) return;
            let maxCellWidth = 25;
            column.eachCell?.({includeEmpty: true}, cell => {
                const cellValue = cell.value;
                cell.alignment = {
                    horizontal: 'center',
                    vertical: 'middle',
                    wrapText: true
                };
                const value = cellValue === null || cellValue === undefined ? '' : cellValue.toString();
                if (value.length > maxCellWidth) {
                    maxCellWidth = 40;
                }
            });
            column.width = maxCellWidth;
        });

        // Generate buffer and save as Excel
        workbook.xlsx.writeBuffer().then(buffer => {
            const finalName = fileName.endsWith(EXCEL_EXTENSION) ? fileName : `${fileName}${EXCEL_EXTENSION}`;
            const blob = new Blob([buffer], {type: EXCEL_MIME_TYPE});
            saveAs(blob, finalName);
        });
    }

    public htmlToText(html: string | null | undefined): string {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        // textContent handles decoding entities too (&nbsp;, &amp;, ...)
        return div.textContent || div.innerText || '';
    }

}
