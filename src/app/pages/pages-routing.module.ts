import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuccessPageComponent } from './success-page/success-page.component';
import { ProfileComponentComponent } from './profile-component/profile-component.component';

const routes: Routes = [
    {
        path: "",
        component: DashboardComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'service-management',
        loadChildren: () => import('./service-management/service-management.module').then(m => m.ServiceManagementModule)
    },
    {
        path: 'user-tasks',
        loadChildren: () => import('./user-tasks/user-tasks.module').then(m => m.UserTasksModule)
    },
    {
        path: 'external-reviewers',
        loadChildren: () => import('./external-reviewers/external-reviewers.module').then(m => m.ExternalReviewersModule)
    },
    {
        path: 'users-permissions-management',
        loadChildren: () => import('./users-and-permissions-management/users-and-permissions-management.module').then(m => m.UsersAndPermissionsManagementModule)
    },
    {
        path: 'user-management-admin',
        loadChildren: () => import('./user-management-admin/user-management-admin.module').then(m => m.UserManagementAdminModule)
    },


    // school perfomance 
    {
        path: 'school-performance',
        loadChildren: () => import('./school-performance/school-performance.module').then(m => m.SchoolPerformanceModule)
    },

    {
        path: 'profile',
        component: ProfileComponentComponent
    },
    {
        path: 'success-page',
        component: SuccessPageComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {
}
