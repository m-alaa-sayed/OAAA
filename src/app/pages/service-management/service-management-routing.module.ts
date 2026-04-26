import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    ServicePreviousRequestListComponent
} from "./service-previous-request-list/service-previous-request-list.component";
import {ServiceManagementListComponent} from "./service-management-list/service-management-list.component";
import {hasPermissionGuard} from "../../core/guards/has-permission.guard";
import {Permission} from "../../core/enum/permission";
import {ServiceManagementDetailsComponent} from "./service-management-details/service-management-details.component";
import {
    ServiceCategoryManagementListComponent
} from "./service-category-management-list/service-category-management-list.component";
import {
    ServiceCategoryManagementDetailsComponent
} from "./service-category-management-details/service-category-management-details.component";
import {ServiceOrderComponent} from "./service-order/service-order.component";
import {ServiceCatalogueListComponent} from "./service-catalogue-list/service-catalogue-list.component";
import {ServiceCatalogueDetailsComponent} from "./service-catalogue-details/service-catalogue-details.component";

const routes: Routes = [
    {
        path: 'service-management-list',
        component: ServiceManagementListComponent,
        canActivate: [hasPermissionGuard],
        data: {
            permissions: [Permission.VIEW_SERVICE]
        },
    },
    {path: 'service-management-details/:id', component: ServiceManagementDetailsComponent},
    {path: 'service-category-management-list', component: ServiceCategoryManagementListComponent},
    {path: 'service-category-management-details', component: ServiceCategoryManagementDetailsComponent},
    {path: 'service-category-management-details/:id', component: ServiceCategoryManagementDetailsComponent},
    {path: 'service-order/:categoryId', component: ServiceOrderComponent},

    {path: 'service-catalogue-list', component: ServiceCatalogueListComponent},
    {path: 'service-catalogue-details/:id', component: ServiceCatalogueDetailsComponent},
    {path: 'service-previous-request-list/:serviceCode/:serviceNameAr/:serviceNameEn', component: ServicePreviousRequestListComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceManagementRoutingModule {
}
