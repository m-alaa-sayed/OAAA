import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabItem } from 'src/app/shared/tabs-template/tab-item';
import { RolesListComponent } from '../roles-management/roles-list/roles-list.component';
import { UsersListComponent } from '../users-management/users-list/users-list.component';
import { RoleManagementService } from 'src/app/core/services/role-management.service';
import { RoleOverviewDto } from '../models/role.model';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RootReducerState } from 'src/app/store';
import { selectActiveTab } from 'src/app/store/UserManagement/user-management.selectors';
import { setActiveTab } from 'src/app/store/UserManagement/user-management.actions';
import { AuthService } from 'src/app/core/services/auth.service';
import { Permission } from 'src/app/core/enum/permission';

@Component({
  selector: 'app-users-and-permissions-tabs',
  templateUrl: './users-and-permissions-tabs.component.html',
  styleUrl: './users-and-permissions-tabs.component.scss'
})
export class UsersAndPermissionsTabsComponent implements OnInit, OnDestroy {
  currentTab: number = 1;
  breadCrumbItems!: Array<{}>;
  rolesTabInputs = new Map<string, any>();
  usersTabInputs = new Map<string, any>();
  private destroy$ = new Subject<void>();

  // Data
  rolesList: RoleOverviewDto[] = [];
  mockUsersList: any[] = [];
  hasUsersPermission = false;
  hasRolesPermission = false;
  private rolesLoaded = false;

  constructor(
    private roleManagementService: RoleManagementService,
    private authService: AuthService,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private store: Store<RootReducerState>
  ) {}

  private allTabs: TabItem[] = [
    {
      labelAr: 'إدارة حسابات المستخدمين',
      labelEn: 'User Account Management',
      component: UsersListComponent,
      inputs: this.usersTabInputs
    },
    {
      labelAr: 'الأدوار والصلاحيات',
      labelEn: 'Roles and Permissions',
      component: RolesListComponent,
      inputs: this.rolesTabInputs
    }
  ];
  tabs: TabItem[] = [];

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USERS_AND_PERMISSIONS_MANAGEMENT'), active: true }
    ];
    
    // Subscribe to the active tab from store
    this.store.select(selectActiveTab)
      .pipe(takeUntil(this.destroy$))
      .subscribe(activeTab => {
        this.currentTab = activeTab;
        this.ensureValidCurrentTab();
      });

    this.authService.getUserClaimObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTabsByPermissions();
      });

    this.updateTabsByPermissions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRolesOverview(): void {
    this.rolesLoaded = true;
    this.roleManagementService.getRolesOverview().subscribe({
      next: (data) => {
        this.rolesList = data;
        this.passDataToTabs();
      },
      error: (error) => {
        console.error('Error loading roles overview:', error);
        this.rolesList = [];
        this.passDataToTabs();
      }
    });
  }

  onRoleDeleted(): void {
    this.loadRolesOverview();
  }

  private updateTabsByPermissions(): void {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    this.hasUsersPermission = userPermissions.includes(Permission.ADMIN_GET_ALL_USERS);
    this.hasRolesPermission = userPermissions.includes(Permission.ADMIN_GET_ALL_ROLES);

    const filteredTabs: TabItem[] = [];
    if (this.hasUsersPermission) {
      filteredTabs.push(this.allTabs[0]);
    }
    if (this.hasRolesPermission) {
      filteredTabs.push(this.allTabs[1]);
    }

    this.tabs = filteredTabs;
    this.ensureValidCurrentTab();

    if (this.hasRolesPermission && !this.rolesLoaded) {
      this.loadRolesOverview();
    }
  }

  private ensureValidCurrentTab(): void {
    if (!this.tabs.length) {
      this.currentTab = 0;
      return;
    }
    if (this.currentTab < 1 || this.currentTab > this.tabs.length) {
      this.currentTab = 1;
    }
  }

  passDataToTabs(): void {
    // Pass data to Roles and Permissions tab
    this.rolesTabInputs.set('rolesList', this.rolesList);
    this.rolesTabInputs.set('onRoleDeleted', () => this.onRoleDeleted());

    // Pass data to Users tab
    //implemented in userList component to handle panination and filtering
  }

}
