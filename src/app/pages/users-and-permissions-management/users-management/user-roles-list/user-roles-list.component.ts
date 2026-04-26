import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { UserBasicInfoData } from '../../components/user-basic-info/user-basic-info.component';
import { AssignUserRoleModalComponent } from '../assign-user-role-modal/assign-user-role-modal.component';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { UserDetailsDto, UserRolesDto } from 'src/app/core/models/user-details.model';
import { LanguageUtil } from 'src/app/core/util/language.util';

@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-roles-list.component.html',
  styleUrl: './user-roles-list.component.scss'
})
export class UserRolesListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  userId: string | null = null;

  fullUserData: UserDetailsDto | null = null;

  columns: any[] = [];
  actions: any[] = [];
  rolesList: UserRolesDto[] = [];
  returnTab: number = 1; // Default to users tab

  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private usersManagementService: UsersManagementService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    // Read returnTab query param
    const returnTabParam = this.route.snapshot.queryParamMap.get('returnTab');
    if (returnTabParam) {
      this.returnTab = +returnTabParam;
    }

    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USERS_AND_PERMISSIONS_MANAGEMENT'), link: '/jawda/users-permissions-management' },
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USER_ROLES'), active: true }
    ];
    this.prepareColumns();
    this.prepareActions();
    this.loadUserData();
  }

  loadUserData(): void {
    if (!this.userId) {
      console.error('User ID is required');
      return;
    }

    this.isLoading = true;
    this.usersManagementService.getUserById(this.userId).subscribe({
      next: (response) => {
        if (response?.data) {
          const user = response.data;

          this.fullUserData = user;

          this.rolesList = user.userRoles || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
          { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
        );
      }
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  prepareColumns(): void {
    this.columns = [
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.GROUP',
        width: 180,
        valueGetter: (params: any) =>
          LanguageUtil.getLocalizedValue(params.data.role?.group?.nameAr, params.data.role?.group?.nameEn),
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLE_NAME',
        width: 180,
        valueGetter: (params: any) =>
          LanguageUtil.getLocalizedValue(params.data.role?.roleNameAr, params.data.role?.roleNameEn),
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLE_SYSTEM_STATUS',
        width: 130,
        valueGetter: (params: any) =>
          this.translate.instant('PAGES.COMMON.LABELS.' + (params.data.role?.isActive ? 'ACTIVE' : 'INACTIVE')),
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLE_USER_STATUS',
        width: 140,
        valueGetter: (params: any) =>
          this.translate.instant('PAGES.COMMON.LABELS.' + (params.data.isActive ? 'ACTIVE' : 'INACTIVE')),
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLE_TYPE',
        width: 120,
        valueGetter: (params: any) =>
          this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.' + (params.data.role?.typeCode || 'PROCEDURAL')),
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.GRANT_STATUS',
        width: 120,
        valueGetter: (params: any) =>
          this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.' + (params.data.isPermanent ? 'PERMANENT' : 'TEMPORARY')),
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.GRANT_DATE',
        width: 180,
        valueGetter: (params: any) =>
          params.data.startDate ? this.formatDate(params.data.startDate) : '',
        cellStyle: { textAlign: 'center', direction: 'ltr' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.VALIDITY_START_DATE',
        width: 180,
        valueGetter: (params: any) =>
          params.data.startDate ? this.formatDate(params.data.startDate) : '',
        cellStyle: { textAlign: 'center', direction: 'ltr' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.VALIDITY_END_DATE',
        width: 180,
        valueGetter: (params: any) =>
          params.data.endDate ? this.formatDate(params.data.endDate) : '',
        cellStyle: { textAlign: 'center', direction: 'ltr' }
      },
      // {
      //   headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.IS_TEMPORARY',
      //   width: 100,
      //   valueGetter: (params: any) =>
      //     this.translate.instant('PAGES.COMMON.LABELS.' + (!params.data.isPermanent ? 'YES' : 'NO')),
      //   cellStyle: { textAlign: 'center' }
      // },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.DELETION_STATUS',
        width: 100,
        valueGetter: (params: any) =>
          this.translate.instant('PAGES.COMMON.LABELS.' + (params.data.isDeleted ? 'YES' : 'NO')),
        cellStyle: { textAlign: 'center' }
      }
    ];
  }

  prepareActions(): void {
    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-fill',
        callback: (row: any) => this.deleteRole(row.data),
        show: (row: any) => !row.data.isDeleted
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
        icon: 'ri-pencil-fill',
        callback: (row: any) => this.editRole(row.data),
        show: (row: any) => !row.data.isDeleted
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.viewRoleDetails(row.data)
      }
    ];
  }

  loadUserRoles(): void {
    if (this.userId) {
      this.loadUserData();
    }
  }

  assignRole(): void {
    // Navigate to assign role page
    this.router.navigate([
      '/jawda/users-permissions-management/users',
      this.userId,
      'assign-role'
    ], {
      queryParams: {
        mode: 'add',
        returnTab: this.returnTab
      }
    });
  }

  viewRoleDetails(role: UserRolesDto): void {
    // Navigate with both the userRole ID (id) and the actual role ID (roleId)
    this.router.navigate([
      '/jawda/users-permissions-management/users/roles',
      this.userId,
      role.id // Pass the userRole ID as the route param
    ], {
      queryParams: {
        mode: 'view',
        roleId: (role as any).role?.id // Pass the actual role ID as query param
      }
    });
  }

  editRole(role: UserRolesDto): void {
    // Navigate to edit role page
    this.router.navigate([
      '/jawda/users-permissions-management/users',
      this.userId,
      'edit-role',
      role.id // userRole ID
    ], {
      queryParams: {
        mode: 'edit',
        roleId: (role as any).role?.id, // actual role ID
        returnTab: this.returnTab
      }
    });
  }

  deleteRole(role: UserRolesDto): void {
    const message = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.DELETE_ROLE_CONFIRMATION_MESSAGE');
    const title = this.translate.instant('PAGES.COMMON.LABELS.ALERT');

    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true).then((result) => {
      if (result.confirmed && this.fullUserData && this.userId) {
        this.isLoading = true;

        // Mark the userRole as deleted instead of removing it
        const updatedUserRoles = (this.fullUserData.userRoles || []).map(ur =>
          ur.id === role.id ? { ...ur, isDeleted: true } : ur
        );

        const { usersAuditEvents, createdOn, createdBy, ...userFullData } = this.fullUserData;
        const updatedUser: UserDetailsDto = {
          ...userFullData,
          userRoles: updatedUserRoles
        };

        this.usersManagementService.updateUser(this.userId, updatedUser, result.notes).subscribe({
          next: () => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
              { classname: 'bg-success text-white', autohide: true, delay: 3000 }
            );
            this.loadUserRoles();
          },
          error: (error) => {
            console.error('Error deleting role:', error);
            this.isLoading = false;
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
              { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
            );
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/jawda/users-permissions-management'], {
      queryParams: { returnTab: this.returnTab }
    });
  }

}
