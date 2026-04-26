import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { RoleDto, GroupDto, ProcedureDto, ProcedureUI, RoleTypeDto, RolesAuditEventDto } from '../../models/role.model';
import { FormMode } from '../../models/mode.model';
import { RoleManagementService } from 'src/app/core/services/role-management.service';

@Component({
  selector: 'app-edit-role-detail',
  templateUrl: './edit-role-detail.component.html',
  styleUrl: './edit-role-detail.component.scss'
})
export class EditRoleDetailComponent implements OnInit {
  title!: string;
  breadCrumbItems!: Array<{}>;
  roleId: number | null = null;
  roleData: RoleDto | null = null;
  historyData: RolesAuditEventDto[] = [];
  procedures: ProcedureUI[] = [];
  groups: GroupDto[] = [];
  roleTypes: RoleTypeDto[] = [
    { code: 'PROCEDURAL', nameAr: 'إجرائي', nameEn: 'Procedural' },
    { code: 'WORKFLOW', nameAr: 'مسار العمل', nameEn: 'Workflow' }
  ];
  mode: FormMode = 'readOnly';
  isLoading: boolean = false;
  isSubmitting: boolean = false; // For loading/spinner state
  showValidationErrors: boolean = false; // For showing red borders on invalid fields
  returnTab: number = 2; // Default to roles tab

  private originalRoleNameAr: string = '';
  private originalRoleNameEn: string = '';
  isDirty: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private toastService: ToastService,
    private roleManagementService: RoleManagementService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    this.mode = modeParam as FormMode || 'readOnly';
    this.title = this.mode === 'edit'?  this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.EDIT_ROLE') : this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.VIEW_ROLE');
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roleId = idParam ? parseInt(idParam, 10) : null;

    // Read returnTab query param
    const returnTabParam = this.route.snapshot.queryParamMap.get('returnTab');
    if (returnTabParam) {
      this.returnTab = +returnTabParam;
    }

    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ROLES_AND_PERMISSIONS'), link: '/jawda/users-permissions-management' },
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ROLE_DETAILS'), active: true }
    ];
    this.loadRoleDetails();
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
        checked: perm.isMandatory && proc.enabled ? true : (perm.enabled || false),
        isMandatory: perm.isMandatory || false
      }))
    }));
  }

  loadRoleDetails(): void {
    if (!this.roleId) {
      return;
    }

    this.isLoading = true;
    this.roleManagementService.getRoleById(this.roleId).subscribe({
      next: (data) => {
        this.roleData = data;
        this.originalRoleNameAr = this.roleData?.roleNameAr || '';
        this.originalRoleNameEn = this.roleData?.roleNameEn || '';

        if (this.roleData?.group) {
          this.groups = [this.roleData.group];
        }

        if (this.roleData?.procedures && this.roleData.procedures.length > 0) {
          this.procedures = this.mapProceduresToUI(this.roleData.procedures);
        } else {
          this.procedures = [];
        }
        this.loadHistoryData();
        this.isLoading = false;
        this.isDirty = false;
      },
      error: (error) => {
        console.error('Error loading role details:', error);
        this.toastService.show(
          this.translate.instant(`PAGES.COMMON.MESSAGES.${error || 'GENERIC_ERROR'}`),
          { classname: 'bg-danger text-white', autohide: false }
        );
        this.isLoading = false;
      }
    });
  }

  loadProceduresFromGroup(): void {
    const group = this.roleData?.group;

    if (!group || !group.procedures || group.procedures.length === 0) {
      this.procedures = [];
      return;
    }

    // Map procedures with all enabled flags set to false (new group selection)
    this.procedures = group.procedures.map(proc => ({
      id: proc.id,
      code: proc.code,
      label: this.translate.currentLang === 'ar' ? (proc.nameAr || '') : (proc.nameEn || ''),
      enabled: false,
      permissions: (proc.permissions || []).map(perm => ({
        id: perm.id,
        permissionCode: perm.permissionCode,
        label: this.translate.currentLang === 'ar' ? (perm.permissionNameAr || '') : (perm.permissionNameEn || ''),
        checked: false,
        isMandatory: perm.isMandatory || false
      }))
    }));
  }

  onGroupChange(newGroup: GroupDto | null): void {
    if (this.roleData) {
      this.roleData.group = newGroup ?? undefined;
    }
    this.loadProceduresFromGroup();
  }

  loadHistoryData(): void {
    console.log(this.roleData?.rolesAuditEventList)
    if (this.roleData?.rolesAuditEventList && this.roleData.rolesAuditEventList.length > 0) {
      this.historyData = this.roleData.rolesAuditEventList;
    } else {
      this.historyData = [];
    }
  }

  goBack(): void {
    this.router.navigate(['/jawda/users-permissions-management'], {
      queryParams: { returnTab: this.returnTab }
    });
  }

  enableEditMode(): void {
    this.mode = 'edit';
  }

  cancelEdit(): void {
    this.router.navigate(['/jawda/users-permissions-management'], {
      queryParams: { returnTab: this.returnTab }
    });
  }

  markAsDirty(): void {
    if (this.mode === 'edit') {
      this.isDirty = true;
    }
  }

  private buildRoleDtoForUpdate(): RoleDto {
    return {
      id: this.roleId || undefined,
      roleCode: this.roleData?.roleCode,
      roleNameAr: this.roleData?.roleNameAr,
      roleNameEn: this.roleData?.roleNameEn,
      roleDescriptionAr: this.roleData?.roleDescriptionAr,
      roleDescriptionEn: this.roleData?.roleDescriptionEn,
      isActive: this.roleData?.isActive,
      typeCode: this.roleData?.typeCode,
      categoryCode: this.roleData?.categoryCode,
      createdOn: this.roleData?.createdOn,
      updatedOn: this.roleData?.updatedOn,
      permissions: this.roleData?.permissions,
      procedures: this.procedures.map(proc => ({
        id: proc.id,
        code: proc.code,
        enabled: proc.enabled,
        permissions: proc.permissions.map(permission => ({
          id: permission.id,
          permissionCode: permission.permissionCode,
          enabled: permission.checked
        }))
      })),
      group: this.roleData?.group
    };
  }

  validateRoleData(): boolean {
    if (!this.roleData) {
      return false;
    }

    this.showValidationErrors = true; // Enable validation UI state

    let isValid = true;

    // Validate Role Name Arabic - required
    if (!this.roleData.roleNameAr || this.roleData.roleNameAr.trim() === '') {
      isValid = false;
    } else {
      // Validate Arabic name format: only Arabic letters, digits, and spaces
      const arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s]+$/;
      if (!arabicPattern.test(this.roleData.roleNameAr)) {
        isValid = false;
      }
    }

    // Validate Role Name English - required
    if (!this.roleData.roleNameEn || this.roleData.roleNameEn.trim() === '') {
      isValid = false;
    } else {
      // Validate English name format: only English letters, digits, and spaces
      const englishPattern = /^[a-zA-Z0-9\s]+$/;
      if (!englishPattern.test(this.roleData.roleNameEn)) {
        isValid = false;
      }
    }

    // Validate Group - required
    if (!this.roleData.group) {
      isValid = false;
    }

    // Validate Procedures - at least one permission if enabled
    if (this.roleData.typeCode === 'PROCEDURAL') {
      const hasInvalidProcedure = this.procedures.some(proc => proc.enabled && !proc.permissions.some(p => p.checked));
      if (hasInvalidProcedure) {
        isValid = false;
      }
    }

    // Description is optional, so no validation needed

    if (!isValid) {
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING'),
        { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
      );
    }

    return isValid;
  }

  save(): void {
    if (!this.validateRoleData()) {
      return; // Don't reset showValidationErrors here, let it show the errors
    }
    if (!this.roleData) {
      return;
    }

    const validationRequest = {
      roleId: this.roleId,
      nameAr: this.roleData.roleNameAr,
      nameEn: this.roleData.roleNameEn
    };

    this.isLoading = true;
    this.roleManagementService.validateRoleName(validationRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showValidationErrors = false; // Reset validation state
        if (response.errorCode) {
          const errorKey = response.errorCode === 'ROLE_NAME_ALREADY_EXISTS'
            ? 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.ROLE_NAME_EXISTS_ALERT'
            : 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.GENERAL_ERROR';

          this.toastService.show(
            this.translate.instant(errorKey),
            { classname: 'bg-danger text-white', autohide: false }
          );
          return;
        }

        this.showUpdateConfirmation();
      },
      error: (error) => {
        console.error('Error validating role name:', error);
        this.isLoading = false;
        this.showValidationErrors = false; // Reset validation state

        const errorKey = error === 'ROLE_NAME_ALREADY_EXISTS'
          ? 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.ROLE_NAME_EXISTS_ALERT'
          : 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.GENERAL_ERROR';

        this.toastService.show(
          this.translate.instant(errorKey),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  private showUpdateConfirmation(): void {
    ModalConfirmComponent.openConfirmWithNotes(
      this.modalService,
      'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.CONFIRM_UPDATE_ROLE',
      'PAGES.COMMON.LABELS.CONFIRM',
      true,
      'PAGES.COMMON.LABELS.NOTES'
    ).then((result) => {
      if (result.confirmed) {
        this.proceedToUpdateRole(result.notes);
      }
    });
  }

  proceedToUpdateRole(notes?: string): void {
    if (!this.roleId) {
      return;
    }

    this.isLoading = true;
    const roleDtoToUpdate = this.buildRoleDtoForUpdate();
    this.roleManagementService.updateRole(this.roleId, roleDtoToUpdate, notes).subscribe({
      next: (result) => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'),
          { classname: 'bg-success text-white', delay: 3000 }
        );
        this.isLoading = false;
        this.mode = 'readOnly';
        this.historyData = result.rolesAuditEventList || [];
        this.isDirty = false;
        setTimeout(() => {
          this.goBack();
        }, 1500);
      },
      error: (error) => {
        console.error('Error updating role:', error);

        const errorKey = error === 'ROLE_NAME_ALREADY_EXISTS'
          ? 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.ROLE_NAME_EXISTS_ALERT'
          : 'PAGES.COMMON.MESSAGES.SAVE_ERROR';

        this.toastService.show(
          this.translate.instant(errorKey),
          { classname: 'bg-danger text-white', autohide: false }
        );
        this.isLoading = false;
      }
    });
  }

}
