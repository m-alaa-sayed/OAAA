import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GroupDto, ProcedureDto } from '../../users-and-permissions-management/models/role.model';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { LanguageUtil } from 'src/app/core/util/language.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditProcedureComponent } from '../components/add-edit-procedure/add-edit-procedure.component';
import { UsersManagementAdminService } from 'src/app/core/services/users-management-admin.service';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';


@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  groupId: number | null = null;
  groupData: GroupDto | null = null;

  // Procedures Grid
  proceduresList: ProcedureDto[] = [];
  columns: any[] = [];
  actions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private roleManagementService: RoleManagementService,
    private usersManagementAdminService: UsersManagementAdminService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Get ID from route
    const idParam = this.route.snapshot.paramMap.get('groupId');
    if (idParam) {
      this.groupId = +idParam;
      this.loadGroupData();
    }

    this.initBreadcrumb();
    this.prepareColumns();
    this.prepareActions();
  }

  initBreadcrumb(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.USER_MANAGEMENT_ADMIN'), link: '/jawda/user-management-admin' },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.EDIT_GROUP'), active: true }
    ];
  }

  loadGroupData(): void {
    if (!this.groupId) return;

    // Check if passed in state (optimization)
    const state = history.state;
    if (state && state.groupData && state.groupData.id === this.groupId) {
      this.groupData = state.groupData;
      this.proceduresList = this.groupData?.procedures || [];
      return;
    }

    // Fallback: Fetch all groups and find by ID (Since getGroupById doesn't exist yet)
    this.roleManagementService.getGroups().subscribe({
      next: (groups) => {
        this.groupData = groups.find(g => g.id === this.groupId) || null;
        if (this.groupData) {
          this.proceduresList = this.groupData.procedures || [];
        } else {
          this.toastService.show(
            this.translate.instant('PAGES.COMMON.MESSAGES.DATA_NOT_FOUND'),
            { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
          );
        }
      },
      error: (error) => {
        console.error('Error loading group data:', error);
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
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
        field: 'code',
        minWidth: 300,
        sortable: true,
        filter: true,
        cellStyle: { textAlign: 'center' }
      },
      {
        headerName: this.translate.instant('PAGES.COMMON.LABELS.NAME'),
        field: 'name', 
        minWidth: 300,
        sortable: true,
        filter: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return lang === 'ar' ? params.data.nameAr : params.data.nameEn;
        }
      },
      {
        headerName: this.translate.instant('PAGES.COMMON.LABELS.DESCRIPTION'),
        field: 'description', 
        minWidth: 480,
        sortable: true,
        filter: true,
        cellStyle: { textAlign: 'center' },
        valueGetter: (params: any) => {
          return lang === 'ar' ? params.data.descriptionAr : params.data.descriptionEn;
        }
      }
    ];
  }

  prepareActions(): void {
    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
        icon: 'ri-delete-bin-fill',
        callback: (row: any) => this.deleteProcedure(row.data)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
        icon: 'ri-pencil-fill',
        callback: (row: any) => this.editProcedure(row.data)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.VIEW'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.viewProcedure(row.data)
      },
    ];
  }

  addProcedure(): void {
    const modalRef = this.modalService.open(AddEditProcedureComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.mode = 'add';
    modalRef.componentInstance.procedure = null;

    modalRef.result.then(
      (result) => {
        if (result) {
          // Prepare the request body
          const body = {
            ...result,
            groupId: this.groupId,
          };

          // Call the API to add the procedure
          this.usersManagementAdminService.addProcedure(body).subscribe({
            next: (response) => {
              this.toastService.show(
                this.translate.instant('PAGES.COMMON.MESSAGES.CREATED_SUCCESSFULLY'),
                { classname: 'bg-success text-white', autohide: true, delay: 3000 }
              );
              
              // Add the new procedure to the list
              this.proceduresList = [...this.proceduresList, response];

              setTimeout(() => {
                this.viewProcedure(response);                
              }, 1000);
            },
            error: (error) => {
              console.error('Error adding procedure:', error);
              this.toastService.show(
                this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_SAVING_DATA'),
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

  viewProcedure(procedure: ProcedureDto): void {
    this.router.navigate(['/jawda/user-management-admin/groups', this.groupId, 'procedures', procedure.id]);
  }

  editProcedure(procedure: ProcedureDto): void {
    const modalRef = this.modalService.open(AddEditProcedureComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.procedure = procedure;

    modalRef.result.then(
      (result) => {
        if (result) {
          // Prepare the request body for update
          const body = {
            ...result,
            id: procedure.id,
            groupId: this.groupId,
            permissions: procedure.permissions
          };

          // Call the API to update the procedure
          this.usersManagementAdminService.updateProcedure(procedure.id, body).subscribe({
            next: (response) => {
              this.toastService.show(
                this.translate.instant('PAGES.COMMON.MESSAGES.UPDATE_SUCCESS'),
                { classname: 'bg-success text-white', autohide: true, delay: 3000 }
              );

              setTimeout(() => {
                this.viewProcedure(response);                
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

  deleteProcedure(procedure: ProcedureDto): void {
    const message = this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_CONFIRMATION_MESSAGE');
    const title = this.translate.instant('PAGES.COMMON.LABELS.DELETE');

    ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
      if (confirmed) {
        this.usersManagementAdminService.deleteProcedure(procedure.id!).subscribe({
          next: () => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
              { classname: 'bg-success text-white', autohide: true, delay: 3000 }
            );
            // Remove the deleted procedure from the list
            this.proceduresList = this.proceduresList.filter(p => p.id !== procedure.id);
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

  goBack(): void {
    this.router.navigate(['/jawda/user-management-admin']);
  }
}
