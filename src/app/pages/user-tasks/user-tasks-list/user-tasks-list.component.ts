import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RequestDto } from '../model/request-dto';
import { TaskService } from 'src/app/core/services/task.service';
import { AppConstants } from 'src/app/core/constants/app-constants';

@Component({
  selector: 'user-tasks-list',
  templateUrl: './user-tasks-list.component.html',
  styleUrl: './user-tasks-list.component.scss',
  providers: [DecimalPipe]
})
export class UserTasksListComponent implements OnInit {


  requestList: RequestDto[] = [];
  columns: any[] = [];
  actions: any;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.prepareGridHeaderCols();
  }
  ngOnInit(): void {
    this.retrieveUserTasks();
  }


  retrieveUserTasks() {
    this.taskService.getUserTasks(this.preparedFilterObject()).subscribe({
      next: (res) => {
        if (res.data) {
          this.requestList = res.data;
        }
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  preparedFilterObject() {
    const workflowSearchDto = {
      roles: null,
      userId: null
    };
    return workflowSearchDto;
  }


  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: 'applicationNo',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICATION_NO'
      },
      {
        field: this.translate.currentLang === 'en' ? 'fullNameEn' : 'fullNameAr',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICANT_USER'
      },
      {
        field: 'requestDate',
        headerName: 'PAGES.USER_TASKS.LABELS.REQUEST_DATE',
        valueFormatter: (params: any) =>
          this.translate.currentLang === 'ar'
            ? new Date(params.value).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : new Date(params.value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
      },
      {
        field: this.translate.currentLang === 'en' ? 'serviceNameEn' : 'serviceNameAr',
        headerName: 'PAGES.USER_TASKS.LABELS.SERVICES_NAME',
        cellStyle: { textAlign: 'center' },
        width: 300
      },
      {
        field: 'assignedDate',
        headerName: 'PAGES.USER_TASKS.LABELS.ASSIGN_DATE',
        width: 210,
        valueFormatter: (params: any) =>
          this.translate.currentLang === 'ar'
            ? new Date(params.value).toLocaleString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
            : new Date(params.value).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
        filter: 'agDateColumnFilter',
        filterParams: {
          browserDatePicker: true,
          comparator: (filterDate: Date, cellValue: string) => {
            if (!cellValue) return -1;

            const cellDate = new Date(cellValue);
            // Remove time part
            const cellDateOnly = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
            const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());

            if (cellDateOnly < filterDateOnly) return -1;
            if (cellDateOnly > filterDateOnly) return 1;
            return 0;
          }
        }
      }
      ,
      {
        field: 'isRequestOverdue',
        headerName: 'PAGES.USER_TASKS.LABELS.SLA_STATUS',
        cellRenderer: (params: any) => {
          const isOverdue = params.value === true;

          const badgeClass = isOverdue ? 'bg-danger' : 'bg-success';
          const iconClass = isOverdue ? 'fa-circle-xmark' : 'fa-circle-check';
          const label = isOverdue
            ? this.translate.instant('PAGES.USER_TASKS.LABELS.EXCEED_SLA')
            : this.translate.instant('PAGES.USER_TASKS.LABELS.WITHIN_SLA');

          return `
            <div class="d-flex justify-content-center align-items-center" style="height: 100%;">
              <span class="badge rounded-pill ${badgeClass} text-white d-flex align-items-center px-3 py-2">
                <i class="fa-regular ${iconClass} me-1"></i>${label}
              </span>
            </div>`;
        },
        sortable: false,
        filter: false,
        suppressMenu: true,
        floatingFilter: false
      }

    ];

    this.actions = [
      { label: 'details', icon: 'ri-eye-fill', callback: (row: RequestDto) => this.openDetails(row, 'view') }
    ];
  }


  openDetails(row: any, mode: string) {
    const serviceCode = row.data.serviceCode;
    this.router.navigate([AppConstants.SERVICE_REQUEST_DETAILS[serviceCode as keyof typeof AppConstants.SERVICE_REQUEST_DETAILS], row.data.id, row.data.taskId]);
  }
}
