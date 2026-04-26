import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-actions-section-renderer',
  template: `
    <div class="d-flex">
      <a
        *ngFor="let action of actions"
        class="btn-action"
        [ngClass]="action.class || 'btn-default'"
        [title]="action.label"
        [attr.href]="action.link ? action.link(rowData) : null"
        (click)="action.callback(rowData)"
        style="cursor:pointer; margin-right:6px; text-decoration:none;"
      >
        <i [class]="action.icon" aria-hidden="true"></i>
      </a>

      <!-- <button
        *ngFor="let action of actions"
        class="btn-action"
        [ngClass]="action.class || 'btn-default'"
        [title]="action.label"
        (click)="action.callback(rowData)">
        <i [class]="action.icon" aria-hidden="true"></i>
      </button> -->
    </div>
  `,
  styles: [`
    .d-flex {
      display: flex;
      flex-direction: row-reverse;
      gap: 8px;
      justify-content: center;
      align-items: center;
    }

    .actions-section {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
    }

    .btn-action {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .btn-action i {
      font-size: 16px;
      line-height: 1;
    }

    .btn-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .btn-action.btn-details {
      background-color: #007bff;
      color: white;
    }

    .btn-action.btn-details:hover {
      background-color: #0056b3;
    }

    .btn-action.btn-view {
      background-color: #17a2b8;
      color: white;
    }

    .btn-action.btn-view:hover {
      background-color: #138496;
    }

    .btn-action.btn-edit {
      background-color: #ffc107;
      color: #212529;
    }

    .btn-action.btn-edit:hover {
      background-color: #e0a800;
    }

    .btn-action.btn-download {
      background-color: #28a745;
      color: white;
    }

    .btn-action.btn-download:hover {
      background-color: #218838;
    }

    .btn-action.btn-manage {
      background-color: #6f42c1;
      color: white;
    }

    .btn-action.btn-manage:hover {
      background-color: #5a32a3;
    }

    .btn-action.btn-delete {
      background-color: #dc3545;
      color: white;
    }

    .btn-action.btn-delete:hover {
      background-color: #c82333;
    }

    .btn-action.btn-default {
      background-color: #6c757d;
      color: white;
    }

    .btn-action.btn-default:hover {
      background-color: #5a6268;
    }
  `]
})
export class ActionButtonsRendererComponent implements ICellRendererAngularComp {
  actions: any[] = [];
  rowData: any;

  agInit(params: any): void {
    this.rowData = params;
    this.actions = params.actions || [];
    this.actions = this.actions.filter(action => {
      // If `show` is defined, evaluate it; otherwise, default to true
      return typeof action.show === 'function' ? action.show(this.rowData) : true;
    });
  }

  refresh(): boolean {
    return false;
  }
}
