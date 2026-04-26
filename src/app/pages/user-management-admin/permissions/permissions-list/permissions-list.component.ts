import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PermissionDto } from '../../../users-and-permissions-management/models/role.model';
import { AddEditPermissionComponent } from '../../components/add-edit-permission/add-edit-permission.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service';
import { UsersManagementAdminService } from 'src/app/core/services/users-management-admin.service';
import { Router } from '@angular/router';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.component.html',
  styleUrl: './permissions-list.component.scss'
})
export class PermissionsListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  // Permissions Grid
  permissionsList: PermissionDto[] = [];
  columns: any[] = [];
  actions: any[] = [];

  constructor(
    public translate: TranslateService,
    private modalService: NgbModal,
    private usersManagementAdminService: UsersManagementAdminService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.PERMISSIONS_LIST'), active: true }
    ];

    this.loadPermissionsData();
    this.prepareColumns();
    this.prepareActions();
  }

  loadPermissionsData(): void {
    this.usersManagementAdminService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissionsList = data;
      },
      error: (error) => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  prepareColumns(): void {
    const lang = this.translate.currentLang || 'ar';

    this.columns = [
      {
        headerName: this.translate.instant('PAGES.COMMON.LABELS.CODE'),
        field: 'permissionCode',
        minWidth: 300,
        sortable: true,
        filter: true,
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: this.translate.instant('PAGES.COMMON.LABELS.NAME'),
        field: 'permissionName',
        minWidth: 300,
        sortable: true,
        filter: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return lang === 'ar' ? params.data.permissionNameAr : params.data.permissionNameEn;
        }
      },
      {
        headerName: this.translate.instant('PAGES.COMMON.LABELS.DESCRIPTION'),
        field: 'permissionDescription',
        minWidth: 480,
        sortable: true,
        filter: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return lang === 'ar' ? params.data.permissionDescriptionAr : params.data.permissionDescriptionEn;
        }
      },
    ];
  }

  prepareActions(): void {
    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-fill',
        callback: (row: any) => this.deletePermission(row.data)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
        icon: 'ri-pencil-fill',
        callback: (row: any) => this.editPermission(row.data)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.VIEW'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.viewPermission(row.data)
      }
    ];
  }

  viewPermission(permission: PermissionDto): void {
    // Navigate to edit permission page
    this.router.navigate(['/jawda/user-management-admin/permissions', permission.id]);
  }

  addPermission(): void {
    const modalRef = this.modalService.open(AddEditPermissionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.permission = null;

    modalRef.result.then(
      (result) => {
        if (result) {
          // Call the API to add the permission
          this.usersManagementAdminService.addPermission(result).subscribe({
            next: (response) => {
              this.toastService.show(
                this.translate.instant('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY'),
                { classname: 'bg-success text-white', autohide: true, delay: 3000 }
              );

              // Add the new permission to the list
              this.permissionsList = [...this.permissionsList, response];

              setTimeout(() => {
                // Refresh permissions list
                this.viewPermission(response)
              }, 1000);
            },
            error: (error) => {
              console.error('Error adding permission:', error);
              this.toastService.show(
                this.translate.instant(`PAGES.COMMON.MESSAGES.${error}`),
                { classname: 'bg-danger text-white', autohide: false }
              );
            }
          });
        }
      },
    );
  }

  editPermission(permission: PermissionDto): void {
    const modalRef = this.modalService.open(AddEditPermissionComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.permission = permission;

    modalRef.result.then(
      (result) => {
        if (result) {
          // Prepare the request body for update
          const body = {
            ...result,
            id: permission.id,
          };

          // Call the API to update the procedure
          this.usersManagementAdminService.updatePermission(permission.id, body).subscribe({
            next: (response) => {
              this.toastService.show(
                this.translate.instant('PAGES.COMMON.MESSAGES.UPDATE_SUCCESS'),
                { classname: 'bg-success text-white', autohide: true, delay: 3000 }
              );

              setTimeout(() => {
                this.viewPermission(response);
              }, 1000);
            },
            error: (error) => {
              this.toastService.show(
                this.translate.instant(`PAGES.COMMON.MESSAGES.${error}`),
                { classname: 'bg-danger text-white', autohide: false }
              );
            }
          });
        }
      }
    );

  }

  deletePermission(permission: PermissionDto): void {
    const message = this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_CONFIRMATION_MESSAGE');
    const title = this.translate.instant('PAGES.COMMON.LABELS.DELETE');

    ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
      if (confirmed) {
        this.usersManagementAdminService.deletePermission(permission.id!).subscribe({
          next: () => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
              { classname: 'bg-success text-white', autohide: true, delay: 3000 }
            );
            // Remove the deleted permission from the list
            this.permissionsList = this.permissionsList.filter(p => p.id !== permission.id);
          },
          error: (error) => {
            this.toastService.show(
              this.translate.instant(`PAGES.COMMON.MESSAGES.${error}`),
              { classname: 'bg-danger text-white', autohide: false }
            );
          }
        });
      }
    });
  }
}
