import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersAndPermissionsTabsComponent } from './tabs/users-and-permissions-tabs.component';

import { EditRoleDetailComponent } from './roles-management/edit-role-detail/edit-role-detail.component';
import { EditUserComponent } from './users-management/edit-user/edit-user.component';
import { UserRolesListComponent } from './users-management/user-roles-list/user-roles-list.component';
import { UserRoleDetailComponent } from './users-management/user-role-detail/user-role-detail.component';
import { AddRoleComponent } from './roles-management/add-role/add-role.component';
import { AddUserComponent } from './users-management/add-user/add-user.component';
import { ChangePasswordComponent } from './users-management/change-password/change-password.component';
import { AssignEditUserRoleComponent } from './users-management/assign-edit-user-role/assign-edit-user-role.component';
import { UserSuccessPageComponent } from './components/user-success-page/user-success-page.component';

import { RolePermissionsListComponent } from './roles-management/role-permissions-list/role-permissions-list.component';

const routes: Routes = [
    { path: '', component: UsersAndPermissionsTabsComponent },
    { path: 'roles/add', component: AddRoleComponent },
    { path: 'roles/add/:type', component: AddRoleComponent },
    { path: 'roles/:id/permissions', component: RolePermissionsListComponent },
    { path: 'roles/:id', component: EditRoleDetailComponent },
    { path: 'users/add', component: AddUserComponent },
    { path: 'users/success', component: UserSuccessPageComponent },
    { path: 'users/:id', component: EditUserComponent },
    { path: 'users/roles/:id', component: UserRolesListComponent },
    { path: 'users/:userId/assign-role', component: AssignEditUserRoleComponent },
    { path: 'users/:userId/edit-role/:userRoleId', component: AssignEditUserRoleComponent },
    { path: 'users/roles/:userId/:roleId', component: UserRoleDetailComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersAndPermissionsManagementRoutingModule { }
