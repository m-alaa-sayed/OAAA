import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { UsersManagementAdminService } from 'src/app/core/services/users-management-admin.service';
import { PermissionDto } from 'src/app/pages/users-and-permissions-management/models/role.model';

@Component({
  selector: 'app-permission-details',
  templateUrl: './permission-details.component.html',
  styleUrl: './permission-details.component.scss'
})
export class PermissionDetailsComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
    // Get IDs from route
    const permissionIdParam = this.route.snapshot.paramMap.get('permissionId');

    if (permissionIdParam) {
      this.permissionId = +permissionIdParam;
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
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  initBreadcrumb(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.PERMISSIONS_LIST'), active: true, link: '/jawda/user-management-admin/permissions' },
      { label: this.translate.instant('PAGES.USER_MANAGEMENT_ADMIN.TITLES.PERMISSION_DETAILS'), active: true }
    ];
  }


  goBack(): void {
    this.router.navigate(['/jawda/user-management-admin/permissions']);
  }
}
