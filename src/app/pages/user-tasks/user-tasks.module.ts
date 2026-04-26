import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from 'src/app/shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { UserTasksListComponent } from './user-tasks-list/user-tasks-list.component';
import { UserTasksRoutingModule } from './user-tasks-routing.module';

@NgModule({
    declarations: [
        UserTasksListComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        TranslateModule,
        NgbPaginationModule,
        UserTasksRoutingModule
    ]
})
export class UserTasksModule {
}
