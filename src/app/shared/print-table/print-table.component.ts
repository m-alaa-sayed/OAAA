import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintTableComponent implements OnInit, OnChanges {
  @Input() columnDefs: any[] = [];
  @Input() rowData: any[] = [];
  @Input() title?: string;
  @Input() showSummary?: boolean = false;
  @Input() maxRowsPerPage: number = 15; // Optimized for A4 pages
  @Input() tableHeadColor?: string = '#0f0'; // Optional thead background color

  // Cached computed properties
  public paginatedDataCache: any[][] = [];
  public visibleColumnsCache: any[] = [];
  private lastRowDataLength = 0;
  private lastColumnDefsLength = 0;

  constructor(
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Process data immediately on initialization
    this.updateCachedData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recalculate when inputs change
    if (changes['rowData'] || changes['columnDefs'] || changes['maxRowsPerPage']) {
      this.updateCachedData();
    }
  }

  /**
   * Update cached data when inputs change
   */
  private updateCachedData(): void {
    // Always update to ensure component is in correct state
    this.lastRowDataLength = this.rowData?.length || 0;
    this.lastColumnDefsLength = this.columnDefs?.length || 0;
    
    // Update visible columns cache
    this.visibleColumnsCache = this.columnDefs?.filter(col => col.hide !== true) || [];
    
    // Update paginated data cache
    this.paginatedDataCache = [];
    if (this.rowData && this.rowData.length > 0) {
      this.paginatedDataCache = this.paginateData(this.rowData, this.maxRowsPerPage);
    }
    
    // Trigger change detection
    this.cdr.markForCheck();
  }

  /**
   * Get paginated data for A4 printing - now cached
   */
  get paginatedData(): any[][] {
    return this.paginatedDataCache;
  }

  /**
   * Get visible column definitions (excluding hidden columns) - now cached
   */
  get visibleColumns(): any[] {
    return this.visibleColumnsCache;
  }

  /**
   * Paginate data into chunks suitable for A4 pages
   */
  private paginateData(data: any[], rowsPerPage: number): any[][] {
    const pages: any[][] = [];
    for (let i = 0; i < data.length; i += rowsPerPage) {
      pages.push(data.slice(i, i + rowsPerPage));
    }
    return pages;
  }

  /**
   * Get column header with translation support
   */
  getColumnHeader(colDef: any): string {
    if (colDef.headerName) {
      return this.translate.instant(colDef.headerName);
    }
    return colDef.field || '';
  }

  /**
   * Get cell value with support for valueGetter and nested properties
   */
  getCellValue(rowData: any, colDef: any): any {
    if (colDef.valueGetter) {
      return colDef.valueGetter({ data: rowData });
    }
    
    if (colDef.field) {
      return this.getNestedProperty(rowData, colDef.field);
    }
    
    return '';
  }

  /**
   * Get nested property value using dot notation
   */
  private getNestedProperty(obj: any, path: string): any {
    if (!obj || !path) return '';
    
    return path.split('.').reduce((current, property) => {
      return current && current[property] !== undefined ? current[property] : '';
    }, obj);
  }

  /**
   * Format cell value for display
   */
  formatCellValue(value: any, colDef: any): string {
    if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
      return '--';
    }

    // Handle dates
    if (colDef.cellRenderer === 'date' || (typeof value === 'string' && this.isDateString(value))) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }

    // Handle numbers
    if (typeof value === 'number') {
      if (colDef.cellRenderer === 'percentage') {
        return `${value.toFixed(1)}%`;
      }
      return value.toLocaleString();
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return this.translate.instant(value ? 'COMMON.YES' : 'COMMON.NO');
    }

    return String(value);
  }

  /**
   * Check if string is a valid date
   */
  private isDateString(str: string): boolean {
    return /^\d{4}-\d{2}-\d{2}/.test(str) || /^\d{2}\/\d{2}\/\d{4}/.test(str);
  }

  /**
   * Get summary statistics for the table
   */
  getSummaryInfo(): { totalRows: number; totalPages: number } {
    return {
      totalRows: this.rowData.length,
      totalPages: this.paginatedData.length
    };
  }

  /**
   * Get cell CSS classes (handle both string and function types)
   * For print mode, we simplify dynamic classes to avoid context issues
   */
  getCellClass(row: any, colDef: any): string {
    if (!colDef.cellClass) {
      return '';
    }

    // If cellClass is a string, return it directly
    if (typeof colDef.cellClass === 'string') {
      return colDef.cellClass;
    }

    // If cellClass is a function, we'll try to execute it safely
    if (typeof colDef.cellClass === 'function') {
      try {
        // Create parameters object for ag-grid cellClass function
        const params = {
          value: this.getCellValue(row, colDef),
          data: row,
          node: { data: row },
          colDef: colDef,
          column: colDef,
          api: null,
          context: null,
          rowIndex: this.rowData.indexOf(row)
        };

        const result = colDef.cellClass(params);
        return typeof result === 'string' ? result : '';
      } catch (error) {
        // If the function can't be executed (like arrow functions bound to component context),
        // we'll return a safe default based on common patterns
        console.debug('CellClass function cannot be executed in print context, using fallback');
        
        // Check if this appears to be a disabled cell pattern (common case)
        if (colDef.editable === false || 
            (typeof colDef.editable === 'function' && colDef.field && colDef.field.includes('NotApplicable'))) {
          return 'disabled-cell';
        }
        
        return '';
      }
    }

    return '';
  }

  /**
   * Get cell CSS classes in a safer way for ngClass directive
   */
  getSafeCellClass(row: any, colDef: any): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {};
    
    try {
      const className = this.getCellClass(row, colDef);
      if (className) {
        // Split multiple classes if they exist
        const classNames = className.split(' ').filter(c => c.trim());
        classNames.forEach(c => classes[c.trim()] = true);
      }
    } catch (error) {
      // Silently handle any errors and return empty classes object
      console.debug('Error resolving cell classes for print:', error);
    }
    
    return classes;
  }

  /**
   * Get optimized column widths for A4 printing
   * Distributes available width among visible columns
   */
  getColumnWidth(index: number): string {
    const totalColumns = this.visibleColumns.length;
    if (totalColumns === 0) return 'auto';
    
    // For A4 at 50% scale, we have roughly 800px effective width
    // Distribute width based on column count
    if (totalColumns <= 4) {
      return '25%';
    } else if (totalColumns <= 6) {
      return '16.66%';
    } else if (totalColumns <= 8) {
      return '12.5%';
    } else {
      // For very wide tables, use smaller fixed width
      return '10%';
    }
  }
}