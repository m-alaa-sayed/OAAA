import { Component, OnInit, Input } from '@angular/core';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleOverviewDto } from '../../models/role.model';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { UserManagementNavigationService } from 'src/app/core/services/user-management-navigation.service';
import { Permission } from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss'
})
export class RolesListComponent extends BaseTabComponent implements OnInit {

  // Expose Permission enum for template usage
  protected readonly Permission = Permission;
  
  @Input() rolesList: RoleOverviewDto[] = [];
  @Input() onRoleDeleted: () => void = () => { };
  columns: any[] = [];
  actions: any[] = [];

  constructor(
    public translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private roleManagementService: RoleManagementService,
    private toastService: ToastService,
    private userManagementNavigationService: UserManagementNavigationService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareColumns();
    this.prepareActions();
  }

  prepareColumns(): void {
    this.columns = [
      {
        field: 'groupNameAr',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.GROUP',
        width: 150,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          const lang = this.translate.currentLang || 'ar';
          return lang === 'ar' ? params.data.groupNameAr : params.data.groupNameEn;
        }
      },
      {
        field: 'roleNameAr',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLE_NAME',
        width: 200,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          const lang = this.translate.currentLang || 'ar';
          return lang === 'ar' ? params.data.roleNameAr : params.data.roleNameEn;
        }
      },
      {
        field: 'roleDescriptionAr',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.DESCRIPTION',
        flex: 1,
        minWidth: 250,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          const lang = this.translate.currentLang || 'ar';
          return lang === 'ar' ? params.data.roleDescriptionAr : params.data.roleDescriptionEn;
        }
      },
      {
        field: 'createdOn',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CREATE_DATE',
        width: 150,
        cellStyle: { textAlign: 'center', direction: 'ltr' },
        valueGetter: (params: any) => {
          if (params.data.createdOn) {
            return new Date(params.data.createdOn).toLocaleDateString('en-US');
          }
          return '';
        }
      },
      {
        field: 'typeCodeNameAr',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLE_TYPE',
        width: 180,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          const lang = this.translate.currentLang || 'ar';
          return lang === 'ar' ? params.data.typeCodeNameAr : params.data.typeCodeNameEn;
        }
      },
      {
        field: 'isActive',
        headerName: 'PAGES.COMMON.LABELS.STATUS',
        width: 120,
        valueGetter: (params: any) => {
          const status = params.data.isActive ? 'ACTIVE' : 'INACTIVE';
          return this.translate.instant('PAGES.COMMON.LABELS.' + status);
        },
        cellStyle: { textAlign: 'center' }
      }
    ];
  }

  prepareActions(): void {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    
    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-6-fill',
        callback: (row: any) => this.deletePermission(row.data),
        show: (row: any) => (row.data.typeCodeNameEn !== "Workflow" || this.hasPortalAdminRole()) && userPermissions.includes(Permission.ADMIN_DELETE_ROLE)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
        icon: 'ri-pencil-fill',
        callback: (row: any) => this.editPermission(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_UPDATE_ROLE)
      },
      {
        label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.PERMISSIONS'),
        icon: 'ri-shield-user-fill',
        callback: (row: any) => this.managePermissions(row.data),
        show: () => this.hasPortalAdminRole() && userPermissions.includes(Permission.ADMIN_VIEW_ROLES)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.viewPermission(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_VIEW_ROLES)
      }
    ];
  }

  managePermissions(permission: RoleOverviewDto): void {
    this.userManagementNavigationService.setRolesTab();
    this.router.navigate(['/jawda/users-permissions-management/roles', permission.id, 'permissions']);
  }

  viewPermission(permission: RoleOverviewDto): void {
    this.userManagementNavigationService.setRolesTab();
    this.router.navigate(['/jawda/users-permissions-management/roles', permission.id]);
  }

  editPermission(permission: RoleOverviewDto): void {
    this.userManagementNavigationService.setRolesTab();
    this.router.navigate(['/jawda/users-permissions-management/roles/', permission.id], {
      queryParams: { mode: 'edit' }
    });
  }

  deletePermission(permission: RoleOverviewDto): void {
    if (!permission.id) {
      return;
    }

    const lang = this.translate.currentLang || 'ar';
    const roleName = lang === 'ar' ? permission.roleNameAr : permission.roleNameEn;
    const message = (lang === 'ar' ? 'هل أنت متأكد من حذف هذا السجل؟ ' : 'Are you sure you want to delete this record? ');
    const title = this.translate.instant('PAGES.COMMON.LABELS.CONFIRM_DELETE_TITLE');

    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true).then((result) => {
      if (result.confirmed) {
        this.roleManagementService.deleteRole(permission.id!, result.notes).subscribe({
          next: () => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
              { classname: 'bg-success text-white', delay: 3000 }
            );
            this.onRoleDeleted();
          },
          error: (error) => {
            this.toastService.show(
              this.translate.instant(`PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.${error || 'DELETE_ERROR'}`),
              { classname: 'bg-danger text-white', autohide: false }
            );
          }
        });
      }
    });
  }

  addPermission(): void {
    this.userManagementNavigationService.setRolesTab();
    this.router.navigate(['/jawda/users-permissions-management/roles/add']);
  }

  addWorkflowRole(): void {
    this.userManagementNavigationService.setRolesTab();
    this.router.navigate(['/jawda/users-permissions-management/roles/add/workflow']);
  }

  hasPortalAdminRole(): boolean {
    const userClaim = this.authService.getUserClaim();
    return userClaim?.roles?.includes('PORTAL_ADMIN') ?? false;
  }

}
