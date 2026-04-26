import { Component, OnInit } from '@angular/core';
import { ServiceManagementService } from 'src/app/core/services/service-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { OaaaServiceDto } from "../types/oaaa-service-dto";
import { AuthService } from 'src/app/core/services/auth.service';
import { Permission } from 'src/app/core/enum/permission';

@Component({
  selector: 'service-management-list',
  templateUrl: './service-management-list.component.html',
  styleUrl: './service-management-list.component.scss'
})
export class ServiceManagementListComponent implements OnInit {
  protected readonly Permission = Permission;


  aaaaServiceDtoList: OaaaServiceDto[] = [];
  columns: any[] = [];
  actions: any;

  constructor(private serviceManagementService: ServiceManagementService,
    private authService: AuthService,
    private toastService: ToastService, public translate: TranslateService,
    private router: Router) {
    this.prepareGridHeaderCols();
  }
  ngOnInit(): void {
    this.retrieveOaaaServices();
  }


  retrieveOaaaServices() {
    this.serviceManagementService.retrieveOaaaServices().subscribe({
      next: (res) => {
        if (res.data) {
          this.aaaaServiceDtoList = res.data;
          this.aaaaServiceDtoList.sort((a, b) => (a.serviceDisplayOrder ?? 0) - (b.serviceDisplayOrder ?? 0));
        }
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: 'serviceCode', headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SERVICE_CODE',
        cellStyle: { textAlign: 'center' },
        width: 250
      },
      {
        field: this.translate.currentLang === 'en' ? 'serviceNameEn' : 'serviceNameAr', headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SERVICES_NAME',
        cellStyle: { textAlign: 'center' },
        width: 250
      },
      {
        field: this.translate.currentLang === 'en' ? 'categoryNameEn' : 'categoryNameAr', headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.CATEGORY',
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SERVICE_TYPE',
        valueGetter: (params: any) =>
          params.data.externalService
            ? this.translate.instant('PAGES.SEVERVICE_MANAGEMENT.LABELS.EXTERNAL_SERVICE')
            : this.translate.instant('PAGES.SEVERVICE_MANAGEMENT.LABELS.INTERNAL_SERVICE'),
        filter: 'agSetColumnFilter',
        floatingFilter: true,
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.DISPLAYING_STATUS',
        valueGetter: (params: any) =>
          params.data.displayStatus
            ? this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
            : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
        cellRenderer: null, // force it to not use default checkbox renderer
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.SUBMISSION_STATUS',
        valueGetter: (params: any) =>
          params.data.applyStatus
            ? this.translate.instant('PAGES.COMMON.LABELS.ACTIVE')
            : this.translate.instant('PAGES.COMMON.LABELS.INACTIVE'),
        cellRenderer: null,
        cellStyle: { textAlign: 'center' }
      }
    ];

    this.actions = [
      {
        label: 'edit', icon: 'ri-pencil-fill',
        callback: (row: OaaaServiceDto) => this.openDetails(row, 'edit'),
        show: () => this.authService.getUserClaim()?.permissions?.includes(Permission.EDIT_SERVICE)
      },
      {
        label: 'details', icon: 'ri-eye-fill',
        callback: (row: OaaaServiceDto) => this.openDetails(row, 'view'),
        show: () => this.authService.getUserClaim()?.permissions?.includes(Permission.SERVICE_VIEW_DETAIL)
      }
    ];
  }

  openDetails(row: any, mode: string) {
    this.router.navigate(['/jawda/service-management/service-management-details', row.data.id], { queryParams: { mode: mode } });
  }
}
