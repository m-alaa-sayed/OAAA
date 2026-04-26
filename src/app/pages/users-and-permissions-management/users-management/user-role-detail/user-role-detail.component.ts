import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { UserDetailsDto } from 'src/app/core/models/user-details.model';

@Component({
  selector: 'app-user-role-detail',
  templateUrl: './user-role-detail.component.html',
  styleUrls: ['./user-role-detail.component.scss']
})
export class UserRoleDetailComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  userId: string | null = null;
  roleId: string | null = null;
  userRoleId: string | null = null; // ID of the userRole entry
  mode: string = 'view';

  userFullData: UserDetailsDto | null = null;
  roleData: any = null;
  userRoleData: any = null; // Data from userRoles array
  originalRoleData: any = null;
  procedures: any[] = [];
  historyData: any[] = [];
  selectedGroup: any = null; // For the reusable component

  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private usersManagementService: UsersManagementService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    // The route param 'roleId' is actually the userRole ID
    this.userRoleId = this.route.snapshot.paramMap.get('roleId');
    // The actual role ID is passed as query param
    this.roleId = this.route.snapshot.queryParamMap.get('roleId');
    this.mode = this.route.snapshot.queryParamMap.get('mode') || 'view';

    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USERS_AND_PERMISSIONS_MANAGEMENT'), link: '/jawda/users-permissions-management' },
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USER_ROLES'), link: `/jawda/users-permissions-management/users/roles/${this.userId}` },
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ROLE_DETAILS'), active: true }
    ];

    this.loadUserAndRoleData();
  }

  loadUserAndRoleData(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.usersManagementService.getUserById(this.userId, 'USER_ROLE').subscribe({
      next: (response) => {
        if (response?.data) {
          const user = response.data;
          this.userFullData = user;
          this.findAndMapRoleData(user);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
      }
    });
  }

  private findAndMapRoleData(user: UserDetailsDto): void {
    if (!this.userRoleId) return;

    // Find userRole by userRoleId (the ID from the userRoles array)
    const userRole = user.userRoles?.find(ur => String(ur.id) === this.userRoleId);

    if (!userRole) {
      console.error('UserRole not found with id:', this.userRoleId);
      return;
    }

    // Get role object from userRole (it has nested role object in new API)
    const role = (userRole as any).role;

    // Set selectedGroup for the reusable component
    this.selectedGroup = role?.group || null;

    // Build roleData from userRole and nested role
    this.roleData = {
      id: role?.id,
      userRoleId: userRole.id,
      groupName: this.translate.currentLang === 'ar'
        ? (role?.group?.nameAr || role?.group?.nameEn || '')
        : (role?.group?.nameEn || role?.group?.nameAr || ''),
      roleName: this.translate.currentLang === 'ar'
        ? (role?.roleNameAr || role?.roleNameEn || '')
        : (role?.roleNameEn || role?.roleNameAr || ''),
      roleDescription: role ? role.roleDescriptionAr: '',
      roleType: role?.typeCode || 'PROCEDURAL',
      roleSystemStatus: role?.isActive || false,
      roleUserStatus: userRole.isActive || false,
      grantStatus: userRole.isPermanent ? 'PERMANENT' : 'TEMPORARY',
      isPermanent: userRole.isPermanent !== undefined ? userRole.isPermanent : true,
      validityStartDate: userRole.startDate ? this.formatDateForInput(userRole.startDate) : '',
      validityEndDate: userRole.endDate ? this.formatDateForInput(userRole.endDate) : '',
      isActive: userRole.isActive || false,
      isDeleted: userRole.isDeleted || false,
      procedures: role?.procedures || [],
      historyData: role?.rolesAuditEventList || []
    };

    // Map history data
    this.historyData = this.mapHistoryData(this.userFullData?.usersAuditEvents || []);

    // Map procedures to component property for display
    this.procedures = this.mapProceduresFromRole(role);

    // Store original data for cancel functionality
    this.originalRoleData = { ...this.roleData };
  }

  private mapProceduresFromRole(role: any): any[] {
    if (!role?.procedures || !Array.isArray(role.procedures)) {
      return [];
    }

    return role.procedures.map((proc: any) => ({
      id: proc.id,
      code: proc.code,
      label: this.translate.currentLang === 'ar' ? (proc.nameAr || proc.nameEn || '') : (proc.nameEn || proc.nameAr || ''),
      enabled: proc.enabled || false,
      permissions: (proc.permissions || []).map((perm: any) => ({
        id: perm.id,
        permissionCode: perm.permissionCode,
        label: this.translate.currentLang === 'ar' ? (perm.permissionNameAr || perm.permissionNameEn || '') : (perm.permissionNameEn || perm.permissionNameAr || ''),
        checked: perm.enabled || false
      }))
    }));
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

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  }

  private mapHistoryData(events: any[] = []): any[] {
    return events.map((event: any) => {
      return {
        operationType: event.operationType || event.operationTypeCode || '',
        userFullNameAr: event.userFullNameAr || event.actorUserFullNameAr || '-',
        userFullNameEn: event.userFullNameEn || event.actorUserFullNameEn || '-',
        createdOn: event.createdOn || '',
        notes: event.notes || ''
      };
    });
  }

  getOperationTypeLabel(operationType: string): string {
    if (!operationType) return '-';
    switch (operationType.toUpperCase()) {
      case 'ADD':
      case 'CREATE':
        return 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CREATION';
      case 'UPDATE':
      case 'EDIT':
        return 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.UPDATE';
      case 'DELETE':
        return 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.DELETE';
      default:
        return operationType;
    }
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateTime;
    }
  }

  isProceduralRole(): boolean {
    return this.roleData?.roleType === 'PROCEDURAL';
  }

  isEditMode(): boolean {
    return this.mode === 'edit';
  }

  isViewMode(): boolean {
    return this.mode === 'view';
  }

  canEdit(): boolean {
    return !this.roleData?.isDeleted;
  }

  isTemporaryGrant(): boolean {
    return this.roleData?.isPermanent === false;
  }

  onGrantStatusChange(): void {
    if (this.roleData.isPermanent) {
      this.roleData.validityEndDate = '';
    }
  }

  enableEdit(): void {
    if (this.canEdit()) {
      this.mode = 'edit';
    }
  }

  cancelEdit(): void {
    this.roleData = { ...this.originalRoleData };
    
    this.router.navigate(['/jawda/users-permissions-management/users/roles', this.userId]);
  }

  validateForm(): boolean {
    if (!this.roleData.validityStartDate) {
      alert(this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.START_DATE_REQUIRED'));
      return false;
    }

    if (this.isTemporaryGrant()) {
      if (!this.roleData.validityEndDate) {
        alert(this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.END_DATE_REQUIRED'));
        return false;
      }

      if (new Date(this.roleData.validityEndDate) <= new Date(this.roleData.validityStartDate)) {
        alert(this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.END_DATE_MUST_BE_AFTER_START'));
        return false;
      }
    }

    return true;
  }

  saveChanges(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;

    // Mock success for now
    setTimeout(() => {
      this.isSaving = false;
      this.mode = 'view';
      this.originalRoleData = { ...this.roleData };
      console.log('Role changes saved:', this.roleData);
      alert(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'));
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/jawda/users-permissions-management/users/roles', this.userId]);
  }
}
