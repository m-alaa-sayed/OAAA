import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { RoleDto, RoleRequestDto, GroupDto, ProcedureDto, ProcedureUI, RoleTypeDto } from '../../models/role.model';
import { FormMode } from '../../models/mode.model';
import { RoleManagementService } from 'src/app/core/services/role-management.service';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrl: './add-role.component.scss'
})
export class AddRoleComponent implements OnInit {
    mode: FormMode = 'add';
    breadCrumbItems!: Array<{}>;
    roleData: RoleDto = {
        roleNameAr: '',
        roleNameEn: '',
        roleDescriptionEn: '',
        roleDescriptionAr: '',
        isActive: true,
        typeCode: 'PROCEDURAL',
        group: undefined
    };
    procedures: ProcedureUI[] = [];
    groups: GroupDto[] = [];
    roleTypes: RoleTypeDto[] = [
        { code: 'PROCEDURAL', nameAr: 'إجرائي', nameEn: 'Procedural' },
        { code: 'WORKFLOW', nameAr: 'مسار العمل', nameEn: 'Workflow' }
    ];
    isLoading: boolean = false;
    isSubmitting: boolean = false; // For loading/spinner state
    showValidationErrors: boolean = false; // For showing red borders on invalid fields
    returnTab: number = 2; // Default to roles tab

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private toastService: ToastService,
        private roleManagementService: RoleManagementService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.breadCrumbItems = [
            { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ROLES_AND_PERMISSIONS'), link: '/jawda/users-permissions-management' },
            { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ADD_ROLE_PERMISSIONS'), active: true }
        ];

        // Read query params for returnTab
        this.route.queryParams.subscribe(params => {
            if (params['returnTab']) {
                this.returnTab = +params['returnTab'];
            }
        });

        // Read route params for type (e.g. roles/add/workflow)
        this.route.params.subscribe(params => {
            if (params['type'] && params['type'].toLowerCase() === 'workflow') {
                this.roleData.typeCode = 'WORKFLOW';
            }
        });

        this.loadGroups();
    }

    loadGroups(): void {
        this.roleManagementService.getGroups().subscribe({
            next: (data) => {
                this.groups = data;
            },
            error: (error) => {
                console.error('Error loading groups:', error);
            }
        });
    }

    onGroupChange(selectedGroup: GroupDto | null): void {
        // Update roleData.group with the selected group
        this.roleData.group = selectedGroup ?? undefined;

        // Load procedures from the selected group (groups array has full data from /groups API)
        if (selectedGroup?.procedures && selectedGroup.procedures.length > 0) {
            this.procedures = this.mapProceduresToUI(selectedGroup.procedures);
        } else {
            this.procedures = [];
        }
    }

    private mapProceduresToUI(proceduresDto: ProcedureDto[]): ProcedureUI[] {
        return proceduresDto.map(proc => ({
            id: proc.id,
            code: proc.code,
            label: this.translate.currentLang === 'ar' ? (proc.nameAr || '') : (proc.nameEn || ''),
            enabled: false,
            permissions: (proc.permissions || []).map(perm => ({
                id: perm.id,
                permissionCode: perm.permissionCode,
                label: this.translate.currentLang === 'ar' ? (perm.permissionNameAr || '') : (perm.permissionNameEn || ''),
                checked: false
            }))
        }));
    }

    goBack(): void {
        this.router.navigate(['/jawda/users-permissions-management'], {
            queryParams: { returnTab: this.returnTab }
        });
    }

    validateRoleData(): boolean {
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

        this.isLoading = true;

        // Step 1: Validate role name
        const validationRequest = {
            nameAr: this.roleData.roleNameAr,
            nameEn: this.roleData.roleNameEn,
            roleId: null // null for new role
        };

        this.roleManagementService.validateRoleName(validationRequest).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.showValidationErrors = false; // Reset validation state

                // Check if validation failed
                if (response.errorCode) {
                    // Use the specific error message translation based on error code
                    const errorKey = response.errorCode === 'ROLE_NAME_ALREADY_EXISTS'
                        ? 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.ROLE_NAME_EXISTS_ALERT'
                        : 'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.GENERAL_ERROR';

                    this.toastService.show(
                        this.translate.instant(errorKey),
                        { classname: 'bg-danger text-white', autohide: false }
                    );
                    return;
                }

                // Step 2: Show confirmation modal
                ModalConfirmComponent.openConfirmWithNotes(
                    this.modalService,
                    'PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.CONFIRM_CREATE_ROLE',
                    'PAGES.COMMON.LABELS.CONFIRM',
                    true,
                    'PAGES.COMMON.LABELS.NOTES'
                ).then((result) => {
                    if (result.confirmed) {
                        // Step 3: Create role after confirmation with notes
                        this.createRole(result.notes);
                    }
                });
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

    private createRole(notes?: string): void {
        this.isLoading = true;
        this.showValidationErrors = false; // Reset validation state when actually creating
        const roleRequest = this.buildRoleRequestDto();

        this.roleManagementService.createRole(roleRequest, notes).subscribe({
            next: (createdRole) => {
                this.isLoading = false;
                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY'),
                    { classname: 'bg-success text-white', delay: 3000 }
                );
                // Navigate after a short delay to allow toast to be visible
                setTimeout(() => {
                    this.goBack();
                }, 1500);
            },
            error: (error) => {
                console.error('Error creating role:', error);
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

    private buildRoleRequestDto(): RoleRequestDto {
        const groupId = this.roleData.group?.id;

        const categoryCode = 'GLOBAL';

        const procedurePermissions: { [procedureId: string]: number[] } = {};
        this.procedures.forEach(proc => {
            if (proc.enabled && proc.id) {
                const enabledPermissionIds = proc.permissions
                    .filter(perm => perm.checked && perm.id)
                    .map(perm => perm.id!);

                if (enabledPermissionIds.length > 0) {
                    procedurePermissions[proc.id.toString()] = enabledPermissionIds;
                }
            }
        });

        const requestDto: RoleRequestDto = {
            // roleCode: this.generateRoleCode(),
            roleNameAr: this.roleData.roleNameAr,
            roleNameEn: this.roleData.roleNameEn,
            roleDescriptionAr: this.roleData.roleDescriptionAr,
            roleDescriptionEn: this.roleData.roleDescriptionEn,
            isActive: this.roleData.isActive,
            typeCode: this.roleData.typeCode,
            groupId: groupId,
            // groupCode: groupId,
            categoryCode: categoryCode,
            procedurePermissions: procedurePermissions
        };

        console.log('Request DTO being sent:', requestDto);
        return requestDto;
    }


}
