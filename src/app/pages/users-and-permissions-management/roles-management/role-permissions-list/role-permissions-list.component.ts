
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleDto, PermissionDto } from '../../models/role.model';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { AddPermissionModalComponent } from './add-permission-modal/add-permission-modal.component';

@Component({
  selector: 'app-role-permissions-list',
  templateUrl: './role-permissions-list.component.html',
  styleUrls: ['./role-permissions-list.component.scss']
})
export class RolePermissionsListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  roleId: number | null = null;
  roleData: RoleDto | null = null;
  permissionsList: PermissionDto[] = [];
  groups: any[] = [];
  
  columns: any[] = [];
  actions: any[] = [];
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private roleManagementService: RoleManagementService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.roleId = idParam ? parseInt(idParam, 10) : null;

    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ROLES_AND_PERMISSIONS'), link: '/jawda/users-permissions-management/roles' },
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ROLE_PERMISSIONS'), active: true }
    ];

    this.prepareColumns();
    this.prepareActions();
    this.loadRoleDetails();
  }

  loadRoleDetails(): void {
    if (!this.roleId) return;

    this.isLoading = true;
    this.roleManagementService.getRoleById(this.roleId).subscribe({
      next: (data) => {
        this.roleData = data;
        this.permissionsList = data.permissions || [];
        if (this.roleData?.group) {
          this.groups = [this.roleData.group];
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
          { classname: 'bg-danger text-white', autohide: false }
        );
        this.isLoading = false;
      }
    });
  }

  prepareColumns(): void {
    this.columns = [
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.PERMISSION_NAME',
        field: 'permissionName',
        width: 300,
        valueGetter: (params: any) => 
          this.translate.currentLang === 'ar' ? params.data.permissionNameAr : params.data.permissionNameEn,
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CODE',
        field: 'permissionCode',
        width: 250,
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.DESCRIPTION',
        field: 'description',
        flex: 1,
        minWidth: 300,
        valueGetter: (params: any) => 
          this.translate.currentLang === 'ar' ? params.data.permissionDescriptionAr : params.data.permissionDescriptionEn,
        cellStyle: { textAlign: 'center' }
      }
    ];
  }

  prepareActions(): void {
    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-fill',
        callback: (row: any) => this.deletePermission(row.data),
        show: () => true
      }
    ];
  }

  deletePermission(permission: PermissionDto): void {
    if (!this.roleData || !this.roleId) return;
    
    const message = this.translate.instant('PAGES.COMMON.MESSAGES.CONFIRM_DELETE');
    const title = this.translate.instant('PAGES.COMMON.LABELS.ALERT');

    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true).then((result) => {
      if (result.confirmed) {
        
        // Filter out the permission
        const updatedPermissions = this.roleData?.permissions?.filter(p => p.id !== permission.id) || [];
        
        // Prepare update DTO
        const updateDto = { ...this.roleData, permissions: updatedPermissions };

        this.isLoading = true;
        this.roleManagementService.updateRole(this.roleId!, updateDto, result.notes).subscribe({
            next: (res) => {
                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
                    { classname: 'bg-success text-white', delay: 3000 }
                );
                this.loadRoleDetails(); // Reload to refresh
            },
            error: (err) => {
                this.isLoading = false;
                this.toastService.show(
                   this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_ERROR'),
                   { classname: 'bg-danger text-white', autohide: false }
                );
            }
        });
      }
    });
  }

  assignPermission(): void {
    if (!this.roleData) return;

    const modalRef = this.modalService.open(AddPermissionModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.roleData = this.roleData;

    modalRef.result.then((result) => {
      if (result) {
        this.loadRoleDetails();
      }
    }, (reason) => {
      // Dismissed
    });
  }
}
