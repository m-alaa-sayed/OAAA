import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ServiceManagementRoutingModule} from './service-management-routing.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {
    ServicePreviousRequestListComponent
} from "./service-previous-request-list/service-previous-request-list.component";
import {
    ServiceExecutionStepsComponent
} from "./service-management-details/service-execution-steps/service-execution-steps.component";
import {
    ServiceCategoryManagementListComponent
} from "./service-category-management-list/service-category-management-list.component";
import {
    ServiceCategoryManagementDetailsComponent
} from "./service-category-management-details/service-category-management-details.component";
import {ServiceOrderComponent} from "./service-order/service-order.component";
import {ServiceCardComponent} from "./service-catalogue-list/service-card/service-card.component";
import {ServiceCatalogueListComponent} from "./service-catalogue-list/service-catalogue-list.component";
import {ServiceCatalogueDetailsComponent} from "./service-catalogue-details/service-catalogue-details.component";
import {ServiceManagementDetailsComponent} from "./service-management-details/service-management-details.component";
import {ServiceManagementListComponent} from "./service-management-list/service-management-list.component";

@NgModule({
    declarations: [
        ServiceManagementDetailsComponent,
        ServiceManagementListComponent,
        ServiceExecutionStepsComponent,
        ServiceCategoryManagementListComponent,
        ServiceCategoryManagementDetailsComponent,
        ServiceOrderComponent,
        ServiceCardComponent,
        ServiceCatalogueListComponent,
        ServiceCatalogueDetailsComponent,
        ServicePreviousRequestListComponent,
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        ServiceManagementRoutingModule,
        TranslateModule,
        NgbPaginationModule
    ]
})
export class ServiceManagementModule {
}
