import { Component, Input } from '@angular/core';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'visit-details-tab',
  templateUrl: './visit-details-tab.component.html',
  styleUrl: './visit-details-tab.component.scss'
})
export class VisitDetailsTabComponent extends BaseTabComponent {

  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;

  @Input() isEditMode: boolean = false;

}
