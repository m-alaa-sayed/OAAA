import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { GroupDto, RoleOverviewDto, RoleDto, ProcedureUI, ProcedureDto } from '../../models/role.model';
import { UserBasicInfoData } from '../../components/user-basic-info/user-basic-info.component';
import { UserRoleDto, UserRolesDto, UserDetailsDto } from 'src/app/core/models/user-details.model';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { CommonUtil } from 'src/app/core/util/common-util';
import { LanguageUtil } from 'src/app/core/util/language.util';

@Component({
  selector: 'app-assign-edit-user-role',
  templateUrl: './assign-edit-user-role.component.html',
  styleUrls: ['./assign-edit-user-role.component.scss']
})
export class AssignEditUserRoleComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  userId: string | null = null;
  userRoleId: string | null = null; // For edit mode
  mode: string = 'add'; // 'add' or 'edit'
  returnTab: number = 1;
  
  userFullData: UserDetailsDto | undefined = undefined;
  existingUserRoleIds: string[] = [];
  isEditMode: boolean = false;
  editingRole: UserRoleDto | null = null;
  editingUserRole: UserRolesDto | null = null; // The userRole entry being edited

  // Dropdowns data
  groups: GroupDto[] = [];
  roles: RoleOverviewDto[] = [];
  filteredRoles: RoleOverviewDto[] = [];
  roleDetails: RoleDto | null = null; // Full role details when editing

  // Selected items
  selectedGroup: GroupDto | null = null;
  selectedRole: RoleOverviewDto | null = null;
  selectedRoleType: string = '';

  // Form fields
  roleUserStatus: boolean = true;
  isPermanent: boolean = true;
  validityStartDate: string = '';
  validityEndDate: string = '';

  // Getter for minimum date/time - always returns current datetime in local timezone
  get minDate(): string {
    return this.getLocalDateTimeString(new Date());
  }

  // Getter for minimum end date - should be either start date or current time, whichever is later
  get minEndDate(): string {
    if (this.validityStartDate) {
      const startDateTime = new Date(this.validityStartDate);
      const currentDateTime = new Date();
      const minDateTime = startDateTime > currentDateTime ? startDateTime : currentDateTime;
      return this.getLocalDateTimeString(minDateTime);
    }
    return this.minDate;
  }

  // Helper method to convert Date to local datetime string for datetime-local input
  private getLocalDateTimeString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Procedures for permissions (readonly display)
  procedures: ProcedureUI[] = [];
  historyData: any[] = [];

  // Loading states
  isLoadingGroups: boolean = false;
  isLoadingRoles: boolean = false;

  isSubmitting: boolean = false; // show validation UI when true
  @ViewChild('assignForm') assignForm?: NgForm;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private roleManagementService: RoleManagementService,
    private usersManagementService: UsersManagementService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Get route parameters
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.userRoleId = this.route.snapshot.paramMap.get('userRoleId');
    this.mode = this.route.snapshot.queryParamMap.get('mode') || 'add';
    this.isEditMode = this.mode === 'edit';
    
    const returnTabParam = this.route.snapshot.queryParamMap.get('returnTab');
    if (returnTabParam) {
      this.returnTab = +returnTabParam;
    }

    // Set breadcrumbs
    const breadcrumbLabel = this.isEditMode
      ? this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.EDIT_USER_ROLE')
      : this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.ASSIGN_ROLE');

    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USERS_AND_PERMISSIONS_MANAGEMENT'), link: '/jawda/users-permissions-management' },
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USER_ROLES'), link: `/jawda/users-permissions-management/users/roles/${this.userId}` },
      { label: breadcrumbLabel, active: true }
    ];

    // Load user data first, then load role data
    this.loadUserDataThenRoleData();
  }

  loadUserDataThenRoleData(): void {
    if (!this.userId) {
      console.error('User ID is required');
      return;
    }

    this.isLoadingGroups = true;
    this.usersManagementService.getUserById(this.userId, 'USER_ROLE').subscribe({
      next: (response) => {
        if (response?.data) {
          const user = response.data;
          console.log('user: ', user);
          
          this.userFullData = user;

          // Extract existing role IDs
          this.existingUserRoleIds = (user.userRoles || [])
            .filter((role: UserRolesDto) => !role.isDeleted)
            .map((role: UserRolesDto) => String((role as any).role?.id || ''));

          // If edit mode, find the editing userRole
          if (this.isEditMode && this.userRoleId) {
            const userRoleIdNum = parseInt(this.userRoleId, 10);
            this.editingUserRole = (user.userRoles || []).find((ur: UserRolesDto) => ur.id === userRoleIdNum) || null;
            
            if (this.editingUserRole) {
              const roleId = this.route.snapshot.queryParamMap.get('roleId');
              this.editingRole = roleId ? { id: parseInt(roleId, 10) } : null;
              
              // Remove current role from existing list for edit mode
              this.existingUserRoleIds = this.existingUserRoleIds.filter(id => id !== roleId);
            }
          }

          // Now load role data
          this.loadDataAndPrepopulate();
        }
        this.isLoadingGroups = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoadingGroups = false;
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
          { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
        );
      }
    });
  }

  loadDataAndPrepopulate(): void {
    if (this.isEditMode) {
      // Edit mode: procedures come from getUserById (already have editingUserRole with nested role)
      this.prePopulateForEdit();
    } else if (!this.isEditMode && this.userId) {
      // Add mode: load groups with roles for the user
      this.isLoadingGroups = true;
      this.roleManagementService.getGroupsForAddingRole(this.userId).subscribe({
        next: (groupsData) => {
          this.groups = groupsData;
          this.extractRolesFromGroups();
          this.isLoadingGroups = false;
        },
        error: (error) => {
          console.error('Error loading groups for adding role:', error);
          this.isLoadingGroups = false;
        }
      });
    } else {
      console.warn('Invalid modal state: missing required data');
    }
  }

  private prePopulateForEdit(): void {
    if (!this.editingUserRole) return;

    this.roleUserStatus = this.editingUserRole.isActive !== undefined ? this.editingUserRole.isActive : false;
    this.isPermanent = this.editingUserRole.isPermanent !== undefined ? this.editingUserRole.isPermanent : true;
    this.validityStartDate = this.editingUserRole.startDate ? this.formatDateForInput(this.editingUserRole.startDate) : '';
    this.validityEndDate = this.editingUserRole.endDate ? this.formatDateForInput(this.editingUserRole.endDate) : '';

    // Get the nested role object from userRole (same as user-role-detail)
    const role = (this.editingUserRole as any).role;
    
    if (!role) {
      console.error('No role object found in editingUserRole');
      return;
    }

    // Use group from role
    if (role.group) {
      this.selectedGroup = role.group;
      this.groups = [role.group];
    }

    if (this.selectedGroup) {
      this.selectedRoleType = role.typeCode || '';

      // Build selectedRole from nested role object
      this.selectedRole = {
        id: role.id,
        roleCode: role.roleCode,
        roleNameEn: role.roleNameEn,
        roleNameAr: role.roleNameAr,
        roleDescriptionEn: role.roleDescriptionEn,
        roleDescriptionAr: role.roleDescriptionAr,
        groupCode: role.group?.code || '',
        groupNameAr: role.group?.nameAr || '',
        groupNameEn: role.group?.nameEn || '',
        isActive: role.isActive,
        typeCode: role.typeCode,
        typeCodeNameAr: '',
        typeCodeNameEn: '',
        createdOn: role.createdOn
      };

      this.filteredRoles = [this.selectedRole];

      // Load procedures from nested role object (same as user-role-detail)
      this.procedures = this.mapProceduresFromRole(role);

      // Load history data
      this.historyData = this.mapHistoryData(this.userFullData?.usersAuditEvents || []);
    }
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  private extractRolesFromGroups(): void {
    // Extract all roles from groups into a flat array
    this.roles = [];
    this.groups.forEach(group => {
      if (group.roles && group.roles.length > 0) {
        group.roles.forEach(role => {
          this.roles.push({
            id: role.id,
            roleCode: role.roleCode,
            roleNameEn: role.roleNameEn,
            roleNameAr: role.roleNameAr,
            roleDescriptionEn: role.roleDescriptionEn || '',
            roleDescriptionAr: role.roleDescriptionAr || '',
            groupCode: group.code,
            groupNameAr: group.nameAr || '',
            groupNameEn: group.nameEn || '',
            isActive: role.isActive,
            typeCode: role.typeCode || '',
            typeCodeNameAr: '',
            typeCodeNameEn: '',
            createdOn: role.createdOn
          });
        });
      }
    });
  }

  private filterRolesByGroupAndType(): void {
    if (!this.selectedGroup || !this.selectedRoleType) {
      this.filteredRoles = [];
      return;
    }

    this.filteredRoles = this.roles.filter(role =>
      role.groupCode === this.selectedGroup?.code &&
      role.typeCode === this.selectedRoleType
    );
  }

  private loadProceduresForSelectedRole(): void {
    if (this.selectedRole && this.isProceduralRole()) {
      if (this.isEditMode && this.roleDetails?.procedures) {
        this.procedures = this.mapProceduresToUI(this.roleDetails.procedures);
      } else {
        // In add mode, find the role in groups data to get its procedures
        const group = this.groups.find(g => g.code === this.selectedGroup?.code);
        if (group?.roles) {
          const roleWithProcedures = group.roles.find(r => r.id === this.selectedRole?.id);
          if (roleWithProcedures?.procedures) {
            this.procedures = this.mapProceduresToUI(roleWithProcedures.procedures);
          }
        }
      }
    }
  }

  onGroupChange(): void {
    this.selectedRole = null;
    this.procedures = [];
    this.filteredRoles = [];
    this.filterRolesByGroupAndType();
  }

  onRoleTypeChange(): void {
    this.selectedRole = null;
    this.procedures = [];
    this.filterRolesByGroupAndType();
  }

  onRoleChange(): void {
    this.procedures = [];
    
    // Load full role details to get procedures
    if (this.selectedRole?.id) {
      this.isLoadingRoles = true;
      this.roleManagementService.getRoleById(this.selectedRole.id).subscribe({
        next: (roleData) => {
          this.roleDetails = roleData;
          if (roleData.procedures) {
            this.procedures = this.mapProceduresToUI(roleData.procedures);
          }
          this.isLoadingRoles = false;
        },
        error: (error) => {
          console.error('Error loading role details:', error);
          this.isLoadingRoles = false;
        }
      });
    }
  }

  onIsPermanentChange(value: boolean): void {
    this.isPermanent = value;
    if (this.isPermanent) {
      this.validityEndDate = null as any;
    }
  }

  onStartDateChange(): void {
    // Prevent selecting past datetime
    if (this.validityStartDate) {
      const selectedDate = new Date(this.validityStartDate);
      const now = new Date();
      
      if (selectedDate < now) {
        // Use setTimeout to ensure change detection picks up the value change
        setTimeout(() => {
          this.validityStartDate = this.getLocalDateTimeString(now);
        }, 0);
        return;
      }
    }
    
    // If end date is before start date, clear it
    if (this.validityStartDate && this.validityEndDate && this.validityEndDate < this.validityStartDate) {
      this.validityEndDate = '';
    }
  }

  onEndDateChange(): void {
    // Prevent selecting past datetime or datetime before start date
    if (this.validityEndDate) {
      const selectedEndDate = new Date(this.validityEndDate);
      const now = new Date();
      
      // Check if selected time is in the past
      if (selectedEndDate < now) {
        setTimeout(() => {
          this.validityEndDate = this.getLocalDateTimeString(now);
        }, 0);
        return;
      }
      
      // Check if selected time is before start date
      if (this.validityStartDate) {
        const startDate = new Date(this.validityStartDate);
        if (selectedEndDate < startDate) {
          setTimeout(() => {
            this.validityEndDate = this.getLocalDateTimeString(startDate);
          }, 0);
          return;
        }
      }
    }
  }

  private mapProceduresFromRole(role: any): ProcedureUI[] {
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

  private mapProceduresToUI(proceduresDto: ProcedureDto[]): ProcedureUI[] {
    return proceduresDto.map(proc => ({
      id: proc.id,
      code: proc.code,
      label: this.translate.currentLang === 'ar' ? (proc.nameAr || '') : (proc.nameEn || ''),
      enabled: proc.enabled || false,
      permissions: (proc.permissions || []).map(perm => ({
        id: perm.id,
        permissionCode: perm.permissionCode,
        label: this.translate.currentLang === 'ar' ? (perm.permissionNameAr || '') : (perm.permissionNameEn || ''),
        checked: perm.enabled || false
      }))
    }));
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
    return CommonUtil.getOperationTypeLabel(operationType);
  }

  formatDateTime(dateTime: any): string {
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
    return this.selectedRole?.typeCode === 'PROCEDURAL';
  }

  isValid(): boolean {
    if (!this.selectedGroup || !this.selectedRoleType || !this.selectedRole) {
      return false;
    }

    if (!this.validityStartDate) {
      return false;
    }

    if (!this.isPermanent && !this.validityEndDate) {
      return false;
    }

    return true;
  }

  onSave(): void {
    this.isSubmitting = true;

    // Use template-driven form validity when available
    if (this.assignForm && this.assignForm.invalid) {
      // Mark all controls as touched to show validation messages
      try {
        this.assignForm.form?.markAllAsTouched();
      } catch { }
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING'),
        { classname: 'bg-danger text-white', autohide: false }
      );
      return;
    }

    // Fallback to previous programmatic check if form not available
    if (!this.assignForm && !this.isValid()) {
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING'),
        { classname: 'bg-danger text-white', autohide: false }
      );
      return;
    }

    // Build userRole object - preserve existing structure in edit mode, or create minimal structure for add mode
    let userRole: UserRolesDto;
    
    if (this.isEditMode && this.editingUserRole) {
      // Edit mode: update only the fields that can be changed
      userRole = {
        ...this.editingUserRole,
        isPermanent: this.isPermanent,
        startDate: this.formatDateToISO(this.validityStartDate),
        endDate: this.isPermanent ? null : this.formatDateToISO(this.validityEndDate),
        isActive: this.roleUserStatus,
        isDeleted: false
      };
    } else {
      // Add mode: create new userRole with minimal role reference
      userRole = {
        role: {
          id: this.selectedRole?.id
        } as any,
        isPermanent: this.isPermanent,
        startDate: this.formatDateToISO(this.validityStartDate),
        endDate: this.isPermanent ? null : this.formatDateToISO(this.validityEndDate),
        isActive: this.roleUserStatus,
        isDeleted: false
      };
    }

    // Show confirmation popup and handle API call
    const message = this.isEditMode
      ? this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.EDIT_ROLE_CONFIRMATION_MESSAGE')
      : this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.ASSIGN_ROLE_CONFIRMATION_MESSAGE');
    const title = this.isEditMode
      ? this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.EDIT_USER_ROLE')
      : this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.ASSIGN_ROLE');

    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true).then((result) => {
      if (result.confirmed && this.userId) {
        this.isSubmitting = false;
        this.isLoadingGroups = true;

        // Get current user data
        this.usersManagementService.getUserById(this.userId, 'USER_ROLE').subscribe({
          next: (response) => {
            if (response?.data) {
              const currentUser = response.data;
              let updatedUserRoles: UserRolesDto[];

              if (this.isEditMode && this.editingUserRole) {
                // Update existing role
                updatedUserRoles = (currentUser.userRoles || []).map(ur =>
                  ur.id === this.editingUserRole!.id ? { ...userRole, id: this.editingUserRole!.id } : ur
                );
              } else {
                // Add new role
                updatedUserRoles = [...(currentUser.userRoles || []), userRole];
              }

              // Prepare user update payload
              const { usersAuditEvents, createdOn, createdBy, ...userFullData } = currentUser;
              const updatedUser: UserDetailsDto = {
                ...userFullData,
                userRoles: updatedUserRoles
              };

              // Call API to update user
              this.usersManagementService.updateUser(this.userId!, updatedUser, result.notes, 'USER_ROLE').subscribe({
                next: () => {
                  this.isLoadingGroups = false;
                  
                  const successMessage = this.isEditMode
                    ? this.translate.instant('PAGES.COMMON.MESSAGES.UPDATE_SUCCESS')
                    : this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY');
                  
                  this.toastService.show(
                    successMessage,
                    { classname: 'bg-success text-white', autohide: true, delay: 3000 }
                  );
                  
                  // Delay navigation to allow toast to be visible
                  setTimeout(() => {
                    this.goBack();
                  }, 1500);
                },
                error: (error) => {
                  console.error('Error saving role:', error);
                  this.isLoadingGroups = false;
                  this.toastService.show(
                    this.translate.instant(`PAGES.COMMON.MESSAGES.${error}`),
                    { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
                  );
                }
              });
            }
          },
          error: (error) => {
            console.error('Error loading user data:', error);
            this.isLoadingGroups = false;
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
              { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
            );
          }
        });
      } else {
        this.isSubmitting = false;
      }
    }).catch(() => {
      this.isSubmitting = false;
    });
  }

  private formatDateToISO(dateString: string): string {
    if (!dateString) return '';
    if (dateString.includes('T')) {
      return dateString;
    }
    return `${dateString}T00:00:00`;
  }

  goBack(): void {
    this.router.navigate(['/jawda/users-permissions-management/users/roles', this.userId], {
      queryParams: { returnTab: this.returnTab }
    });
  }
}
