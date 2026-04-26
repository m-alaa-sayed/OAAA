import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { UsersAndPermissionsManagementRoutingModule } from './users-and-permissions-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExternalReviewersModule } from '../external-reviewers/external-reviewers.module';
import { UsersAndPermissionsTabsComponent } from './tabs/users-and-permissions-tabs.component';

import { RolesListComponent } from './roles-management/roles-list/roles-list.component';
import { UsersListComponent } from './users-management/users-list/users-list.component';

import { EditUserComponent } from './users-management/edit-user/edit-user.component';
import { UserRolesListComponent } from './users-management/user-roles-list/user-roles-list.component';
import { UserRoleDetailComponent } from './users-management/user-role-detail/user-role-detail.component';
import { AddRoleComponent } from './roles-management/add-role/add-role.component';
import { EditRoleDetailComponent } from './roles-management/edit-role-detail/edit-role-detail.component';
import { AddUserComponent } from './users-management/add-user/add-user.component';
import { RoleBasicInfoFieldsComponent } from './components/role-basic-info-fields/role-basic-info-fields.component';
import { RoleProceduresTableComponent } from './components/role-procedures-table/role-procedures-table.component';
import { EditHistoryTableComponent } from './components/edit-history-table/edit-history-table.component';
import { AddUserPersonalInfoComponent } from './components/user-personal-info-fields/user-personal-info-fields.component';
import { UserBasicInfoComponent } from './components/user-basic-info/user-basic-info.component';
import { AssignUserRoleModalComponent } from './users-management/assign-user-role-modal/assign-user-role-modal.component';
import { AssignEditUserRoleComponent } from './users-management/assign-edit-user-role/assign-edit-user-role.component';
import { ChangePasswordComponent } from './users-management/change-password/change-password.component';
import { UserSuccessPageComponent } from './components/user-success-page/user-success-page.component';
import { RolePermissionsListComponent } from './roles-management/role-permissions-list/role-permissions-list.component';
import { AddPermissionModalComponent } from './roles-management/role-permissions-list/add-permission-modal/add-permission-modal.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { HasPermissionDirective } from "src/app/core/directives/has-permission.directive";

@NgModule({
    declarations: [
        UsersAndPermissionsTabsComponent,
        RolesListComponent,
        UsersListComponent,
        EditUserComponent,
        UserRolesListComponent,
        UserRoleDetailComponent,
        AddRoleComponent,
        EditRoleDetailComponent,
        AddUserComponent,
        RoleBasicInfoFieldsComponent,
        RoleProceduresTableComponent,
        EditHistoryTableComponent,
        AddUserPersonalInfoComponent,
        UserBasicInfoComponent,
        AssignUserRoleModalComponent,
        AssignEditUserRoleComponent,
        ChangePasswordComponent,
        UserSuccessPageComponent,
        RolePermissionsListComponent,
        AddPermissionModalComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    NgbPaginationModule,
    NgbToastModule,
    UsersAndPermissionsManagementRoutingModule,
    ExternalReviewersModule,
    NgSelectModule,
    HasPermissionDirective
]
})
export class UsersAndPermissionsManagementModule { }
