import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { UserOverviewDto, SearchUserDto } from '../../models/users.model';
import { ToastService } from 'src/app/core/services/toast-service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { mode } from 'crypto-js';
import { UserManagementNavigationService } from 'src/app/core/services/user-management-navigation.service';
import { Permission } from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent extends BaseTabComponent implements OnInit, OnDestroy {

  // Expose Permission enum for template usage
  protected readonly Permission = Permission;

  columns: any[] = [];
  actions: any[] = [];
  listData: any[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 20;
  totalElements: number = 0;
  totalPages: number = 0;
  isFirstPage: boolean = true;
  isLastPage: boolean = false;

  // Loading state
  isLoading: boolean = false;

  // Search functionality
  searchCriteria: SearchUserDto = {};
  private searchSubject = new Subject<void>();

  // Expose Math for template
  Math = Math;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private usersManagementService: UsersManagementService,
    private toastService: ToastService,
    private userManagementNavigationService: UserManagementNavigationService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareColumns();
    this.prepareActions();
    this.setupSearchDebounce();
    this.loadUsers();
  }

  /**
   * Setup debounce for search inputs (2 seconds)
   */
  setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0; // Reset to first page on new search
      this.performSearch();
    });
  }

  /**
   * Triggered when any search field changes
   */
  onSearchChange(): void {
    this.searchSubject.next();
  }

  /**
   * Clear all search filters
   */
  clearSearch(): void {
    this.searchCriteria = {};
    this.currentPage = 0;
    this.loadUsers();
  }

  /**
   * Check if there are any active search criteria
   */
  private hasActiveSearchCriteria(): boolean {
    return Object.keys(this.searchCriteria).some(key => {
      const value = (this.searchCriteria as any)[key];
      return value !== null && value !== undefined && value !== '';
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersManagementService.getUsersOverview(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.listData = this.mapUsersToTableData(response.content || []);
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isFirstPage = response.first;
          this.isLastPage = response.last;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.listData = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.isFirstPage = true;
        this.isLastPage = true;
        this.isLoading = false;
      }
    });
  }

  private mapUsersToTableData(users: UserOverviewDto[]): any[] {
    return users.map(user => ({
      id: user.civilNo || user.passportNo || String(user.id || ''),
      visibilityUserId: user.id,
      name: this.translate.currentLang === 'ar'
        ? (user.fullNameAr || user.fullNameEn || '')
        : (user.fullNameEn || user.fullNameAr || ''),
      idType: user.insideOman === null ? 'Civil ID' : (user.insideOman ? 'Civil ID' : 'Passport'),
      email: (user.email || '').replace('.disabled', ''),
      username: user.username || '',
      accountType: user.externalUser ? 'External' : 'Internal',
      school: this.translate.currentLang === 'ar'
        ? (user.organizationNameAr || user.organizationNameEn || '')
        : (user.organizationNameEn || user.organizationNameAr || ''),
      mobile: user.mobileNo || '',
      country: this.translate.currentLang === 'ar'
        ? (user.countryNameAr || user.countryNameEn || '')
        : (user.countryNameEn || user.countryNameAr || ''),
      status: user.status || 'ACTIVE',
      createDate: user.createdOn ? this.formatDate(user.createdOn) : '',
      fullNameAr: user.fullNameAr || '',
      fullNameEn: user.fullNameEn || '',
      civilNo: user.insideOman ? user.civilNo : user.passportNo,
      insideOman: user.insideOman !== null ? user.insideOman : true,
      externalUser: user.externalUser,
      organizationNameAr: user.organizationNameAr || '',
      organizationNameEn: user.organizationNameEn || '',
      groupNameAr: user.groupNameAr || '',
      groupNameEn: user.groupNameEn || '',
      mobileNo: user.mobileNo || '',
      countryNameAr: user.countryNameAr || '',
      countryNameEn: user.countryNameEn || '',
      createdOn: user.createdOn || ''
    }));
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.hasActiveSearchCriteria()) {
      this.performSearch();
    } else {
      this.loadUsers();
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    if (this.hasActiveSearchCriteria()) {
      this.performSearch();
    } else {
      this.loadUsers();
    }
  }

  prepareColumns(): void {
    this.columns = [
      {
        field: 'fullName',
        headerName: 'PAGES.COMMON.LABELS.NAME',
        width: 200,
        valueGetter: (params: any) =>
          this.translate.currentLang === 'ar' ? params.data.fullNameAr : params.data.fullNameEn,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'civilNo',
        headerName: 'PAGES.COMMON.LABELS.ID_NUMBER',
        width: 200,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'insideOman',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ID_TYPE',
        width: 120,
        valueGetter: (params: any) =>
          params.data.insideOman ? this.translate.instant('PAGES.CREATE_ACCOUNT.LABELS.INSIDE_OMAN') : this.translate.instant('PAGES.CREATE_ACCOUNT.LABELS.OUTSIDE_OMAN'),
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'username',
        headerName: 'PAGES.COMMON.LABELS.USERNAME',
        width: 220,
        valueGetter: (params: any) => params.data.username ? params.data.username : params.data.email,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'accountType',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.ACCOUNT_TYPE',
        width: 150,
        valueGetter: (params: any) =>
          params.data.externalUser ? this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.EXTERNAL_USER') : this.translate.instant('PAGES.COMMON.LABELS.AUTHORITY_EMPLOYEE'),
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'center/organization',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CENTER/ORGANIZATION',
        width: 150,
        valueGetter: (params: any) =>
          params.data.externalUser ?
            this.translate.currentLang === 'ar' ? params.data.organizationNameAr : params.data.organizationNameEn
            : this.translate.currentLang === 'ar' ? params.data.groupNameAr : params.data.groupNameEn,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'mobileNo',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.MOBILE',
        width: 140,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'countryName',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.COUNTRY_OF_RESIDENCE',
        width: 150,
        valueGetter: (params: any) =>
          this.translate.currentLang === 'ar' ? params.data.countryNameAr : params.data.countryNameEn,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'status',
        headerName: 'PAGES.COMMON.LABELS.STATUS',
        width: 120,
        valueGetter: (params: any) =>
          this.translate.instant('PAGES.COMMON.LABELS.' + params.data.status),
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'createdOn',
        headerName: 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CREATE_DATE',
        width: 150,
        valueGetter: (params: any) => {
          if (!params.data.createdOn) return '-';
          const date = new Date(params.data.createdOn);
          return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-US');
        },
        cellStyle: { textAlign: 'center', direction: 'ltr' }
      }
    ];
  }

  prepareActions(): void {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];

    this.actions = [
      {
        label: this.translate.instant('PAGES.LOGIN.LABELS.CHANGE_PASSWORD'),
        icon: 'ri-lock-password-fill',
        callback: (row: any) => this.changePassword(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_CHANGE_PASSWORD_FOR_USER) || userPermissions.includes(Permission.ADMIN_VIEW_CHANGE_PASSWORD_FOR_USER)
      },
      {
        label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.ROLES'),
        icon: 'ri-shield-user-fill',
        callback: (row: any) => this.manageRoles(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_VIEW_ROLES) || userPermissions.includes(Permission.ADMIN_GET_ALL_ROLES)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.EDIT'),
        icon: 'ri-pencil-fill',
        callback: (row: any) => this.editUser(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_UPDATE_USER)
      },
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.viewUser(row.data),
        show: () => userPermissions.includes(Permission.ADMIN_VIEW_USERS)
      },
      // {
      //   label: this.translate.instant('PAGES.COMMON.LABELS.DELETE'),
      //   icon: 'ri-delete-bin-fill',
      //   callback: (row: any) => this.deleteUser(row.data),
      //   show: () => userPermissions.includes(Permission.ADMIN_DELETE_USER)
      // }
    ];
  }

  manageRoles(user: any): void {
    this.userManagementNavigationService.setUsersTab();
    this.router.navigate(['/jawda/users-permissions-management/users/roles', user.visibilityUserId]);
  }

  changePassword(user: any): void {
    // Check if user is inactive
    if (user.status && user.status.toUpperCase() === 'INACTIVE') {
      this.showInactiveUserAlert();
      return;
    }

    this.userManagementNavigationService.setUsersTab();
    this.router.navigate(['/jawda/users-permissions-management/change-password'], {
      queryParams: {
        userId: user.visibilityUserId,
        returnTab: 1
      }
    });
  }

  showInactiveUserAlert(): void {
    const modalRef = this.modalService.open(ModalConfirmComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'sm'
    });

    modalRef.componentInstance.title = this.translate.instant('PAGES.COMMON.LABELS.ALERT');
    modalRef.componentInstance.message = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.INACTIVE_USER_PASSWORD_CHANGE');
    modalRef.componentInstance.isAlert = true;
    modalRef.componentInstance.alertType = 'warning';
  }

  editUser(user: any): void {
    this.userManagementNavigationService.setUsersTab();
    this.router.navigate(['/jawda/users-permissions-management/users', user.visibilityUserId], {
      queryParams: { mode: 'edit' }
    });
  }

  viewUser(user: any): void {
    this.userManagementNavigationService.setUsersTab();
    this.router.navigate(['/jawda/users-permissions-management/users', user.visibilityUserId], {
      queryParams: { mode: 'readOnly' }
    });
  }

  deleteUser(user: any): void {
    const message = this.translate.instant('PAGES.COMMON.MESSAGES.CONFIRM_DELETE');
    const title = this.translate.instant('PAGES.COMMON.LABELS.ALERT');

    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true).then((result) => {
      if (result.confirmed) {
        this.usersManagementService.deleteUser(user.visibilityUserId, result.notes).subscribe({
          next: () => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.DELETE_SUCCESSFULLY'),
              { classname: 'bg-success text-white', delay: 3000 }
            );
            this.loadUsers();
          },
          error: (error) => {
            this.toastService.show(
              this.translate.instant(`PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.${error || 'DELETE_ERROR'}`),
              { classname: 'bg-danger text-white', autohide: false }
            );
          }
        });
      }
    });
  }

  addUser(): void {
    this.userManagementNavigationService.setUsersTab();
    this.router.navigate(['/jawda/users-permissions-management/users/add']);
  }

  onServerSideFilter(filterModel: any): void {
    this.searchCriteria = this.convertFilterModelToSearchCriteria(filterModel);
    this.currentPage = 0; // Reset to first page when filtering
    this.performSearch();
  }

  /**
   * Perform search using the search endpoint
   */
  private performSearch(): void {
    const cleanedCriteria: SearchUserDto = {};
    Object.keys(this.searchCriteria).forEach(key => {
      const value = (this.searchCriteria as any)[key];
      if (value !== null && value !== undefined && value !== '') {
        (cleanedCriteria as any)[key] = value;
      }
    });

    // If no search criteria, load all users
    if (Object.keys(cleanedCriteria).length === 0) {
      this.loadUsersWithoutLoading();
      return;
    }

    this.usersManagementService.searchUsersWithoutLoading(cleanedCriteria).subscribe({
      next: (response) => {
        if (response) {
          // Check if response is an array (plain search result) or paginated response
          if (Array.isArray(response)) {
            // Plain array response
            const newData = this.mapUsersToTableData(response as any || []);
            this.listData = [...newData];
            this.totalElements = response.length;
            this.totalPages = response.length > 0 ? 1 : 0;
            this.isFirstPage = true;
            this.isLastPage = true;
          } else {
            // Paginated response
            const newData = this.mapUsersToTableData(response as any || []);
            this.listData = [...newData];
            this.totalElements = response.totalElements || 0;
            this.totalPages = response.totalPages || 0;
            this.isFirstPage = response.first !== undefined ? response.first : true;
            this.isLastPage = response.last !== undefined ? response.last : true;
          }
        }
      },
      error: (error) => {
        this.listData = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.isFirstPage = true;
        this.isLastPage = true;
      }
    });
  }

  /**
   * Load users without showing loading indicator
   */
  private loadUsersWithoutLoading(): void {
    this.usersManagementService.getUsersOverview(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.listData = this.mapUsersToTableData(response.content || []);
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isFirstPage = response.first;
          this.isLastPage = response.last;
        }
      },
      error: (error) => {
        this.listData = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.isFirstPage = true;
        this.isLastPage = true;
      }
    });
  }

  private convertFilterModelToSearchCriteria(filterModel: any): SearchUserDto {
    const searchCriteria: SearchUserDto = {};
    const currentLang = this.translate.currentLang || 'ar';

    if (filterModel) {
      Object.keys(filterModel).forEach(field => {
        const filter = filterModel[field];

        if (filter) {
          // Handle different filter structures
          let filterValue = '';

          if (typeof filter === 'string') {
            filterValue = filter;
          } else if (filter.filter) {
            filterValue = filter.filter;
          } else if (filter.filterType === 'text' && filter.filter) {
            filterValue = filter.filter;
          } else if (filter.filterType === 'set' && filter.values) {
            // For set filters, take the first value or join multiple values
            filterValue = Array.isArray(filter.values) ? filter.values.join(',') : filter.values;
          }

          if (filterValue && filterValue.trim()) {
            switch (field) {
              case 'fullName':
                // Send only the current language field
                if (currentLang === 'ar') {
                  searchCriteria.fullNameAr = filterValue.trim();
                } else {
                  searchCriteria.fullNameEn = filterValue.trim();
                }
                break;
              case 'civilNo':
                searchCriteria.civilNo = filterValue.trim();
                break;
              case 'username':
                searchCriteria.username = filterValue.trim();
                break;
              case 'mobileNo':
                searchCriteria.mobileNo = filterValue.trim();
                break;
              case 'organizationName':
                // Send only the current language field
                if (currentLang === 'ar') {
                  searchCriteria.organizationLookupValueAr = filterValue.trim();
                } else {
                  searchCriteria.organizationLookupValueEn = filterValue.trim();
                }
                break;
              case 'center/organization':
                // Grid column 'center/organization' maps to organization lookup values
                if (currentLang === 'ar') {
                  searchCriteria.organizationLookupValueAr = filterValue.trim();
                  searchCriteria.groupNameAr = filterValue.trim();
                } else {
                  searchCriteria.organizationLookupValueEn = filterValue.trim();
                  searchCriteria.groupNameEn = filterValue.trim();
                }
                break;
              case 'countryName':
                // Send only the current language field
                if (currentLang === 'ar') {
                  searchCriteria.countryNameAr = filterValue.trim();
                } else {
                  searchCriteria.countryNameEn = filterValue.trim();
                }
                break;
              case 'status':
                searchCriteria.status = filterValue.trim();
                break;
              // Add more field mappings as needed
            }
          }
        }
      });
    }

    return searchCriteria;
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

}
