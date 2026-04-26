import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dropdown-filter',
  template: `
    <select 
      [(ngModel)]="selectedValue" 
      (change)="onSelectionChanged()" 
      class="ag-filter-select"
      style="width: 100%; height: 100%; border: none; padding: 0 4px; background: transparent;">
      <option value="">{{ 'PAGES.COMMON.LABELS.ALL' | translate }}</option>
      <option *ngFor="let option of filterOptions" [value]="option">{{ option }}</option>
    </select>
  `
})
export class DropdownFilterComponent implements IFilterAngularComp {
  private params!: IFilterParams;
  public selectedValue: string = '';
  public filterOptions: string[] = [];

  constructor(public translate: TranslateService) {}

  agInit(params: IFilterParams): void {
    this.params = params;
    // Get filter options from column definition or params
    this.filterOptions = params.colDef.filterParams?.options || [];
  }

  isFilterActive(): boolean {
    return this.selectedValue !== null && this.selectedValue !== undefined && this.selectedValue !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (!this.isFilterActive()) {
      return true;
    }
    
    let cellValue: any;
    
    // Check if column has a valueGetter function
    if (this.params.colDef.valueGetter && typeof this.params.colDef.valueGetter === 'function') {
      // Use the valueGetter to get the processed value
      try {
        cellValue = this.params.colDef.valueGetter({
          data: params.data,
          node: params.node,
          colDef: this.params.colDef,
          column: this.params.column,
          context: this.params.context,
          getValue: (field: string) => params.data[field]
        } as any);
      } catch (error) {
        // Fallback to direct field access if valueGetter fails
        const fieldName = this.params.colDef.field;
        cellValue = fieldName ? params.data[fieldName] : params.data;
      }
    } else {
      // Get the field name from the column definition
      const fieldName = this.params.colDef.field;
      cellValue = fieldName ? params.data[fieldName] : params.data;
    }
    
    return cellValue === this.selectedValue;
  }

  getModel(): any {
    if (!this.isFilterActive()) {
      return null;
    }
    return { value: this.selectedValue };
  }

  setModel(model: any): void {
    this.selectedValue = model ? model.value : '';
  }

  onSelectionChanged(): void {
    this.params.filterChangedCallback();
  }
}