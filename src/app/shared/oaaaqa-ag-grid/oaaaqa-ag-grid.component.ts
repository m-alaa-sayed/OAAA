import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AG_GRID_LOCALE_EG, AG_GRID_LOCALE_EN } from '@ag-grid-community/locale';
import { GridOptions } from 'ag-grid-community';
import { Router } from "@angular/router";
import { ActionButtonsRendererComponent } from './ActionButtonsRendererComponent';
import { GridReorderService } from 'src/app/core/services/grid-reorder.service';
import { DropdownFilterComponent } from './DropdownFilterComponent';

@Component({
    selector: 'oaaaqa-ag-grid',
    templateUrl: './oaaaqa-ag-grid.component.html',
    styleUrls: ['./oaaaqa-ag-grid.component.scss']
})
export class OaaaqaAgGridComponent implements OnInit, OnChanges {
    @Input() enableDrage: boolean = false;
    @Input() dataList: any[] = [];
    @Input() selectable: boolean = false;
    @Input() columns: any[] = [];
    @Input() rowSelectionType: any = 'multiple'
    @Input() addPageUrl: string | null = null;
    @Input() actions: { label: string, icon: string, callback: (row: any) => void }[] = [];
    @Input() pagination: boolean = true;
    @Input() paginationPageSize: number = 5;
    @Input() paginationPageSizeSelector: number[] = [5, 10, 20];
    @Input() pinnedBottomRowData: any[] = [];
    @Input() parentComponent: any = null;
    @Input() showRowNumbers: boolean = true;
    @Input() autoSaveOrder: boolean = false;
    @Input() reorderModule: string = '';
    @Input() reorderEntityType: string = '';
    @Input() columnFilterOptions: { [key: string]: string[] } = {}; // field name -> filter options

    // Print-specific inputs
    @Input() enablePrintMode: boolean = true; // Enable print table functionality
    @Input() printTitle?: string; // Title for print version
    @Input() showPrintSummary: boolean = false; // Show summary in print version
    @Input() printMaxRowsPerPage: number = 15; // Rows per page for printing
    @Input() tableHeadColor?: string = '#F1F3F4'; // Optional thead background color for print table

    @Input() actionsColumnWidth: number = 100;
    @Input() enableServerSideFiltering: boolean = false;
    @Input() suppressClientSideFiltering: boolean = false;
    @Input() enableColumnFilters: boolean = true;
    @Input() sizeColumnsToFit: boolean = false;
    selectedList: any[] = [];

    @Output() selectedListChangeEvent = new EventEmitter<any[]>();
    @Output() cellValueChanged = new EventEmitter<any>();
    @Output() rowsOrderChanged = new EventEmitter<{id: any, indexOrder: number}[]>();
    @Output() filterChanged = new EventEmitter<any>();
    @Output() serverSideFilterChanged = new EventEmitter<any>();

    columnDefs: any[] = [];
    private _printableColumnDefs: any[] = [];
    enableRTL: boolean = true;
    gridOptions: GridOptions = {
        localeText: AG_GRID_LOCALE_EG,
        rowSelection: this.rowSelectionType,
        context: { componentParent: this },
        components: {
            dropdownFilter: DropdownFilterComponent
        }
    };

    defaultColDef = {
        resizable: true,
        filter: true,
        floatingFilter: true,
        //flex: 1, // auto-resize to fill space
        minWidth: 100, // optional
        // Apply truncation class to all cells by default so long values are ellipsized.
        // Use a function so we can also add an LTR helper class for phone/number fields
        // (prevents digit re-ordering in RTL mode).
        cellClass: (params: any) => {
            const classes: string[] = ['oaaaqa-cell-truncate'];
            // Respect any user-defined cellClass on the column (string or array)
            const colClass = params?.colDef?.cellClass;
            if (colClass) {
                if (Array.isArray(colClass)) {
                    classes.push(...colClass.filter((c: any) => c !== 'oaaaqa-cell-truncate'));
                } else if (typeof colClass === 'string' && colClass !== 'oaaaqa-cell-truncate') {
                    classes.push(colClass);
                }
            }

            // Auto-detect phone/mobile fields by common names and force LTR so numbers render correctly
            const fieldName = params?.colDef?.field || '';
            const phoneRegex = /(phone|mobile|msisdn|telephone|tel)/i;
            if (phoneRegex.test(fieldName)) {
                classes.push('oaaaqa-ltr');
            }

            return classes;
        },
        // Disable wrap/autoHeight by default so truncation works; individual columns can still enable wrapText/autoHeight
        wrapText: false,
        autoHeight: false,
    };

    selectAll = false;
    gridApi: any;

    constructor(
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router,
        public translate: TranslateService,
        private gridReorderService: GridReorderService) {
    }

    ngOnInit(): void {
        this.enableRTL = this.translate.currentLang === 'ar';
        this.gridOptions.localeText = this.enableRTL ? AG_GRID_LOCALE_EG : AG_GRID_LOCALE_EN;

        this.columnDefs = this.getColumnDefs(this.columns);
        this.updatePrintableColumnDefs();

        // Update context with parent component if provided
        if (this.parentComponent) {
            this.gridOptions.context = { componentParent: this.parentComponent };
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Check if enableDrage, columnFilterOptions, or dataList changed
        if (changes['enableDrage'] || changes['columnFilterOptions']) {
            this.columnDefs = this.getColumnDefs(this.columns);
        }

        // For server-side filtering, handle dataList changes more carefully
        if (changes['dataList'] && this.enableServerSideFiltering && this.gridApi) {
            // Store current filter model
            const currentFilterModel = this.gridApi.getFilterModel();

            // Update data without recreating columns
            setTimeout(() => {
                if (this.gridApi && Object.keys(currentFilterModel).length > 0) {
                    // Restore filter model after data update
                    this.gridApi.setFilterModel(currentFilterModel);
                }
            }, 50);
        } else if (changes['dataList'] && !this.enableServerSideFiltering) {
            // Regular handling for non-server-side filtering
            this.columnDefs = this.getColumnDefs(this.columns);
            this.updatePrintableColumnDefs();
        }
    }

    ngAfterViewInit() {
        if (this.selectable) {
            this.addHeaderCheckboxClickListener();
        }
    }

    addHeaderCheckboxClickListener() {
        const headerCheckbox = this.el.nativeElement.querySelector('.ag-header-select-all');
        if (headerCheckbox) {
            this.renderer.listen(headerCheckbox, 'click', () => {
                this.handleHeaderCheckboxClick();
            });
        }
    }

    handleHeaderCheckboxClick() {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
            this.gridApi.selectAllFiltered();
        } else {
            this.gridApi.deselectAllFiltered();
        }
    }

    onSelectionChanged(params: any) {
        const selectedRows = params.api.getSelectedRows();
        this.selectedList = selectedRows;
        this.selectedListChangeEvent.emit(this.selectedList);
    }

    onCellValueChanged(event: any) {
        this.cellValueChanged.emit(event);
    }

    onFilterChanged(event: any) {
        this.filterChanged.emit(event);

        // Emit server-side filtering event if enabled
        if (this.enableServerSideFiltering) {
            const filterModel = event.api.getFilterModel();
            this.serverSideFilterChanged.emit(filterModel);
        }
    }

    onGridReady(params: any) {
        this.gridApi = params.api;

        if (this.sizeColumnsToFit) {
            setTimeout(() => {
                this.gridApi?.sizeColumnsToFit();
            }, 0);
        }

        // Add event listener for custom save events from pinned row

    }

    onGridSizeChanged(): void {
        if (this.sizeColumnsToFit && this.gridApi) {
            this.gridApi.sizeColumnsToFit();
        }
    }

    routToNewItemPage() {
        this.router.navigate([this.addPageUrl]);
    }

    private getColumnDefs(columns: any[]) {
        const gridColumns = [];
        if (this.enableDrage) {
            gridColumns.push(
                {
                    headerName: '',
                    field: 'drag',
                    rowDrag: true,
                    width: 40,
                }
            )
        }
        if (this.selectable) {
            gridColumns.push({ checkboxSelection: true, headerCheckboxSelection: true, width: 50 });
        } else if (this.showRowNumbers) {
            gridColumns.push({
                headerName: this.translate.instant('PAGES.COMMON.LABELS.RECORD_NUMBER'),
                valueGetter: 'node.rowIndex + 1',
                width: 60,
                maxWidth: 60,
                minWidth: 60,
                suppressMenu: true,
                sortable: false,
                filter: false,
                floatingFilter: false
            });
        }


        const translatedColumns = columns.map(column => {
            const translatedHeader = column.headerName ? this.translate.instant(column.headerName) : column.headerName;

            // Support grouped headers: { headerName, children: [...] }
            if (Array.isArray(column.children) && column.children.length > 0) {
                return {
                    ...column,
                    headerName: translatedHeader,
                    children: column.children.map((child: any) => {
                        const childHeader = child.headerName ? this.translate.instant(child.headerName) : child.headerName;
                        const hasDropdownFilter = this.columnFilterOptions[child.field];

                        let childConfig: any = {
                            ...child,
                            filter: this.enableColumnFilters ? (child.filter || true) : false,
                            sortable: this.enableServerSideFiltering ? false : !this.suppressClientSideFiltering,
                            suppressMenu: false,
                            floatingFilter: this.enableColumnFilters,
                            width: child.width || 150,
                            wrapText: true,
                            autoHeight: true,
                            headerName: childHeader,
                            filterParams: child.filterParams || {}
                        };

                        if (hasDropdownFilter && hasDropdownFilter.length > 0) {
                            const filteredOptions = this.getFilteredOptionsForColumn(child, hasDropdownFilter);
                            childConfig.filter = 'dropdownFilter';
                            childConfig.filterParams = {
                                ...childConfig.filterParams,
                                options: filteredOptions
                            };
                        }

                        return childConfig;
                    })
                };
            }

            const hasDropdownFilter = this.columnFilterOptions[column.field];

            let columnConfig: any = {
                ...column,
                filter: this.enableColumnFilters ? (column.filter || true) : false,
                sortable: this.enableServerSideFiltering ? false : !this.suppressClientSideFiltering,
                suppressMenu: false,
                floatingFilter: this.enableColumnFilters,
                width: column.width || 150,
                wrapText: true,
                autoHeight: true,
                headerName: translatedHeader,
                filterParams: column.filterParams || {}
            };

            // Apply dropdown filter if options are provided for this column
            if (hasDropdownFilter && hasDropdownFilter.length > 0) {
                const filteredOptions = this.getFilteredOptionsForColumn(column, hasDropdownFilter);
                columnConfig.filter = 'dropdownFilter';
                columnConfig.filterParams = {
                    ...columnConfig.filterParams,
                    options: filteredOptions
                };
            }

            return columnConfig;
        })

        gridColumns.push(...translatedColumns);

        // Add dynamic action column if actions are provided
        if (this.actions?.length) {
            gridColumns.push({
                headerName: this.translate.instant('PAGES.COMMON.LABELS.ACTIONS'),
                cellRenderer: ActionButtonsRendererComponent,
                cellRendererParams: {
                    actions: this.actions
                },
                width: this.actionsColumnWidth,
                maxWidth: this.actionsColumnWidth,
                minWidth: this.actionsColumnWidth,
                suppressMenu: true,
                sortable: false,
                pinned: this.translate.currentLang === 'en' ? 'right' : 'left'
            });
        }
        return gridColumns;
    }

    onRowDragEnd(event: any) {
        const movedItem = event.node.data;
        const newIndex = event.overIndex;
        const oldIndex = this.dataList.findIndex(i => i === movedItem);

        if (oldIndex === newIndex) {
            return; // No change in position
        }

        // Remove and re-insert the item in dataList
        this.dataList.splice(oldIndex, 1);
        this.dataList.splice(newIndex, 0, movedItem);

        // Create array of ALL items with their new indexes
        const allItemsWithNewIndexes = this.dataList.map((item, index) => ({
            id: item.id || `item-${index}`,
            indexOrder: index
        }));

        console.log('All items with new indexes:', allItemsWithNewIndexes);

        // Emit the entire array with new indexes
        this.rowsOrderChanged.emit(allItemsWithNewIndexes);


        // Reassign to trigger Angular change detection
        this.dataList = [...this.dataList];
    }

    private getFilteredOptionsForColumn(column: any, allOptions: string[]): string[] {
        // Don't filter options - return all provided options
        // This ensures dropdown filters always show all available choices
        return allOptions;
    }

    private getNestedProperty(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    /**
     * Update cached printable column definitions
     */
    private updatePrintableColumnDefs(): void {
        this._printableColumnDefs = this.columnDefs.flatMap(col => {
            // Flatten grouped columns for print mode
            if (Array.isArray(col.children) && col.children.length > 0) {
                return col.children;
            }
            return [col];
        }).filter(col => {
            if (!col.field) {
                return false;
            }
            return !col.cellRenderer ||
                (col.cellRenderer !== ActionButtonsRendererComponent &&
                    col.cellRenderer !== 'actionButtonsRenderer');
        });
    }

    /**
     * Get column definitions suitable for print table (excluding actions and non-printable columns)
     */
    get printableColumnDefs(): any[] {
        return this._printableColumnDefs;
    }

    /**
     * Get row data suitable for printing (excluding pinned rows that might be totals)
     */
    get printableRowData(): any[] {
        // Return main data without pinned bottom rows (which are usually totals)
        return this.dataList || [];
    }
}
