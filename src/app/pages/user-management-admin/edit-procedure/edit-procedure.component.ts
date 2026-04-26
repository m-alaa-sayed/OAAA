import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProcedureDto, PermissionDto } from '../../users-and-permissions-management/models/role.model';
import { ToastService } from 'src/app/core/services/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditPermissionComponent } from '../components/add-edit-permission/add-edit-permission.component';
import { UsersManagementAdminService } from 'src/app/core/services/users-management-admin.service';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-edit-procedure',
  templateUrl: './edit-procedure.component.html',
  styleUrls: ['./edit-procedure.component.scss']
})
export class EditProcedureComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  procedureId: number | null = null;
  groupId: number | null = null;
  procedureData: ProcedureDto | null = null;

  // Permissions Grid
  permissionsList: PermissionDto[] = [];
  columns: any[] = [];
  actions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private toastService: ToastService,
    private usersManagementAdminService: UsersManagementAdminService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // Get IDs from route
    const procedureIdParam = this.route.snapshot.paramMap.get('procedureId');
    const groupIdParam = this.route.snapshot.paramMap.get('groupId');

    if (procedureIdParam) {
      this.procedureId = +procedureIdParam;
    }
    if (groupIdParam) {
      this.groupId = +groupIdParam;
    }

    this.loadProcedureData();
    this.initBreadcrumb();
    this.prepareColumns();
    this.prepareActions();

    console.log('procedure', this.procedureData);

  }

  initBreadcrumb(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.USER_MANAGEMENT_ADMIN'), link: '/jawda/user-management-admin' },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.EDIT_GROUP'), link: `/jawda/user-management-admin/groups/${this.groupId}` },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.EDIT_PROCEDURE'), active: true }
    ];
  }

  loadProcedureData(): void {
    if (!this.procedureId) return;

    // Fallback: Fetch procedure by ID
    this.usersManagementAdminService.getProcedure(this.procedureId).subscribe({
      next: (data) => {
        this.procedureData = data as any;
        this.permissionsList = this.procedureData?.permissions || [];
      },
      error: (error) => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.'+ error),
          { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
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
            procedureId: this.procedureId,
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
                { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
              );
            }
          });
        }
      },
      (reason) => {
        // Modal dismissed
        console.log('Modal dismissed:', reason);
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
                  this.translate.instant('PAGES.COMMON.MESSAGES.'+ error),
                  { classname: 'bg-danger text-white', autohide: false }
                );
              }
            });
          }
        });
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
          // Prepare the request body
          const body = {
            ...result,
            procedureId: this.procedureId,
          };

          // Call the API to add the permission
          this.usersManagementAdminService.addPermission(body).subscribe({
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
                { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
              );
            }
          });
        }
      },
      (reason) => {
        // Modal dismissed
        console.log('Modal dismissed:', reason);
      }
    );
  }

  viewPermission(permission: PermissionDto): void {
    // Navigate to edit permission page
    this.router.navigate(['/jawda/user-management-admin/groups', this.groupId, 'procedures', this.procedureId, 'permissions', permission.id]);
  }

  goBack(): void {
    this.router.navigate(['/jawda/user-management-admin/groups', this.groupId]);
  }
}
