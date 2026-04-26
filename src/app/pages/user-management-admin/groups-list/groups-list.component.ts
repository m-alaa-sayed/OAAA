import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupDto } from '../../users-and-permissions-management/models/role.model';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { Permission } from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrl: './groups-list.component.scss'
})
export class GroupsListComponent extends BaseTabComponent implements OnInit {

  protected readonly Permission = Permission;
  
  breadCrumbItems!: Array<{}>;
  groupsList: GroupDto[] = [];
  columns: any[] = [];
  actions: any[] = [];

  constructor(
    public translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private roleManagementService: RoleManagementService,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.USER_MANAGEMENT_ADMIN'), active: true }
    ];
    
    this.prepareColumns();
    this.prepareActions();
    this.loadGroups();
  }

  prepareColumns(): void {
    const lang = this.translate.currentLang || 'ar';

    this.columns = [
      {
        field: 'code',
        headerName: this.translate.instant('PAGES.COMMON.LABELS.CODE'),
        width: 300,
        cellStyle: { textAlign: 'center' },
      },
      {
        field: 'name',
        headerName: this.translate.instant('PAGES.COMMON.LABELS.NAME'),
        width: 300,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return lang === 'ar' ? params.data.nameAr : params.data.nameEn;
        }
      },
      {
        field: 'description',
        headerName: this.translate.instant('PAGES.COMMON.LABELS.DESCRIPTION'),
        width: 500,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return lang === 'ar' ? params.data.descriptionAr : params.data.descriptionEn;
        }
      }
    ];
  }

  prepareActions(): void {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    
    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.VIEW'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.viewGroup(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_UPDATE_ROLE) || userPermissions.includes(Permission.ADMIN_GET_ALL_GROUPS)
      }
    ];
  }

  loadGroups(): void {
    this.roleManagementService.getGroups().subscribe({
      next: (groups) => {
        this.groupsList = groups;
      },
      error: (error) => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  viewGroup(group: GroupDto): void {
    // Navigate to edit group page
    this.router.navigate(['/jawda/user-management-admin/groups', group.id], {
      queryParams: { mode: 'view' },
      state: { groupData: group }
    });
  }

}
