import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UsersManagementAdminService } from 'src/app/core/services/users-management-admin.service';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { RoleDto, PermissionDto } from '../../../models/role.model';

@Component({
  selector: 'app-add-permission-modal',
  templateUrl: './add-permission-modal.component.html',
  styleUrls: ['./add-permission-modal.component.scss']
})
export class AddPermissionModalComponent implements OnInit {

  @Input() roleData!: RoleDto;

  allPermissions: any[] = [];
  selectedPermissions: any[] = [];
  notes: string = '';
  isLoading = false;
  isSaving = false;

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    private usersManagementAdminService: UsersManagementAdminService,
    private roleManagementService: RoleManagementService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadAllPermissions();
  }

  loadAllPermissions(): void {
    this.isLoading = true;
    this.usersManagementAdminService.getAllPermissions().subscribe({
      next: (data) => {
        // Filter out permissions that the role already has
        const existingIds = new Set(this.roleData?.permissions?.map(p => p.id) || []);
        this.allPermissions = data.filter(p => !existingIds.has(p.id));
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (item.permissionNameEn && item.permissionNameEn.toLocaleLowerCase().indexOf(term) > -1) || 
           (item.permissionNameAr && item.permissionNameAr.toLocaleLowerCase().indexOf(term) > -1) ||
           (item.permissionCode && item.permissionCode.toLocaleLowerCase().indexOf(term) > -1);
  }

  save(): void {
    if (!this.selectedPermissions || this.selectedPermissions.length === 0) {
      return;
    }

    if (!this.notes || this.notes.trim() === '') {
        this.toastService.show(
            this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'),
            { classname: 'bg-danger text-white', autohide: false }
        );
        return;
    }

    this.isSaving = true;

    // Combine existing permissions with new ones
    const currentPermissions = this.roleData.permissions || [];
    const newPermissionsList = [...currentPermissions, ...this.selectedPermissions];
    
    const updateDto = { ...this.roleData, permissions: newPermissionsList };

    this.roleManagementService.updateRole(this.roleData.id!, updateDto, this.notes).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.UPDATE_SUCCESS'),
          { classname: 'bg-success text-white', delay: 3000 }
        );
        this.activeModal.close(true);
      },
      error: (err) => {
        this.isSaving = false;
        const errorKey = err?.errorCode || 'SAVE_ERROR'; // Adjust based on actual error structure if possible
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.' + errorKey, { defaultValue: this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_ERROR') }),
           { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }
}
