import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserTasksListComponent } from './user-tasks-list/user-tasks-list.component';
const routes: Routes = [
    { path: 'user-tasks-list', component: UserTasksListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserTasksRoutingModule { }
