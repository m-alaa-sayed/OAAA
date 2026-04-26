import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-input-renderer',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    template: `
    <div class="p-1">
        <textarea class="form-control form-control-sm" 
               [ngModel]="currentValue" 
               (ngModelChange)="onModelChange($event)"
               [disabled]="!isConflictChecked"
               [class.is-invalid]="params.data.showError && !currentValue"
               rows="2"></textarea>
    </div>
  `
})
export class InputRendererComponent implements ICellRendererAngularComp {
    params: any;
    currentValue: string = '';
    isConflictChecked: boolean = false;

    constructor(private cdr: ChangeDetectorRef) { }

    agInit(params: any): void {
        this.params = params;
        this.currentValue = params.value;
        this.isConflictChecked = params.data.conflictOfInterest;
    }

    refresh(params: any): boolean {
        this.params = params;
        this.currentValue = params.value;
        this.isConflictChecked = params.data.conflictOfInterest;
        this.cdr.detectChanges();
        return true;
    }

    onModelChange(value: string) {
        this.currentValue = value;
        this.params.node.setDataValue(this.params.colDef.field, value);
    }
}
