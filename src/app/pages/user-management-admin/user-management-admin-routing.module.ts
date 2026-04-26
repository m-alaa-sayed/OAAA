import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { EditProcedureComponent } from './edit-procedure/edit-procedure.component';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';
import { PermissionsListComponent } from './permissions/permissions-list/permissions-list.component';
import { PermissionDetailsComponent } from './permissions/permission-details/permission-details.component';

const routes: Routes = [
  { path: '', component: GroupsListComponent },
  { path: 'groups/:groupId', component: EditGroupComponent },
  { path: 'groups/:groupId/procedures/:procedureId', component: EditProcedureComponent },
  { path: 'groups/:groupId/procedures/:procedureId/permissions/:permissionId', component: EditPermissionComponent },
  { path: 'permissions', component: PermissionsListComponent },
  { path: 'permissions/:permissionId', component: PermissionDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementAdminRoutingModule { }
