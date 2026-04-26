import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserManagementAdminRoutingModule } from './user-management-admin-routing.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditGroupComponent } from './edit-group/edit-group.component';
import { GroupBasicInfoComponent } from './components/group-basic-info/group-basic-info.component';
import { EditProcedureComponent } from './edit-procedure/edit-procedure.component';
import { ProcedureBasicInfoComponent } from './components/procedure-basic-info/procedure-basic-info.component';
import { AddEditProcedureComponent } from './components/add-edit-procedure/add-edit-procedure.component';
import { AddEditPermissionComponent } from './components/add-edit-permission/add-edit-permission.component';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';
import { PermissionBasicInfoComponent } from './components/permission-basic-info/permission-basic-info.component';
import { PermissionsListComponent } from './permissions/permissions-list/permissions-list.component';
import { PermissionDetailsComponent } from './permissions/permission-details/permission-details.component';

@NgModule({
  declarations: [
    GroupsListComponent,
    EditGroupComponent,
    GroupBasicInfoComponent,
    ProcedureBasicInfoComponent,
    PermissionBasicInfoComponent,
    EditProcedureComponent,
    AddEditProcedureComponent,
    AddEditPermissionComponent,
    EditPermissionComponent,
    PermissionsListComponent,
    PermissionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    SharedModule,
    UserManagementAdminRoutingModule
  ]
})
export class UserManagementAdminModule { }
