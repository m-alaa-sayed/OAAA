import {Injectable} from '@angular/core';
import * as ExcelJS from 'exceljs';
import {saveAs} from 'file-saver';
import {LanguageUtil} from "../../../core/util/language.util";

const EXCEL_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {

    DATA_ROW_HEIGHT = 25;

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
