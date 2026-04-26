import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PermissionDto } from '../../users-and-permissions-management/models/role.model';
import { ToastService } from 'src/app/core/services/toast-service';
import { UsersManagementAdminService } from 'src/app/core/services/users-management-admin.service';

@Component({
  selector: 'app-edit-permission',
  standalone: false,
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss']
})
export class EditPermissionComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  permissionData: PermissionDto | null = null;
  permissionId: number | null = null;
  procedureId: number | null = null;
  groupId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private toastService: ToastService,
    private usersManagementAdminService: UsersManagementAdminService,
  ) {}

  ngOnInit(): void {
    // Get IDs from route
    const permissionIdParam = this.route.snapshot.paramMap.get('permissionId');
    const procedureIdParam = this.route.snapshot.paramMap.get('procedureId');
    const groupIdParam = this.route.snapshot.paramMap.get('groupId');

    if (permissionIdParam) {
      this.permissionId = +permissionIdParam;
    }
    if (procedureIdParam) {
      this.procedureId = +procedureIdParam;
    }
    if (groupIdParam) {
      this.groupId = +groupIdParam;
    }

    this.loadPermissionData();
    this.initBreadcrumb();
  }

  loadPermissionData(): void {
    if (!this.permissionId) return;

    // Fallback: Fetch permission by ID
    this.usersManagementAdminService.getPermission(this.permissionId).subscribe({
      next: (data) => {
        this.permissionData = data as any;
      },
      error: (error) => {
        console.error('Error loading procedure data:', error);
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  initBreadcrumb(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.USER_MANAGEMENT_ADMIN'), link: '/jawda/user-management-admin' },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.EDIT_GROUP'), link: `/jawda/user-management-admin/groups/${this.groupId}` },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.EDIT_PROCEDURE'), link: `/jawda/user-management-admin/groups/${this.groupId}/procedures/${this.procedureId}` },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.EDIT_PERMISSION'), active: true }
    ];
  }


  goBack(): void {
    this.router.navigate(['/jawda/user-management-admin/groups', this.groupId, 'procedures', this.procedureId]);
  }
}