import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-checkbox-renderer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="d-flex justify-content-center h-100 align-items-center">
        <div class="form-check">
            <input class="form-check-input" type="checkbox" 
                   [checked]="currentValue" 
                   (change)="onChange($event)">
        </div>
    </div>
  `
})
export class CheckboxRendererComponent implements ICellRendererAngularComp {
    params: any;
    currentValue: boolean = false;

    agInit(params: any): void {
        this.params = params;
        this.currentValue = params.value;
    }

    refresh(params: any): boolean {
        this.params = params;
        this.currentValue = params.value;
        return true;
    }

    onChange(event: any) {
        this.currentValue = event.target.checked;
        this.params.node.setDataValue(this.params.colDef.field, this.currentValue);

        // If unchecked, we might want to clear the justification
        if (!this.currentValue) {
            this.params.node.setDataValue('justification', '');
            this.params.node.data.showError = false;
        }

        // Refresh the specific row to trigger update on the justification cell
        this.params.api.refreshCells({
            rowNodes: [this.params.node],
            columns: ['justification'],
            force: true
        });
    }
}
