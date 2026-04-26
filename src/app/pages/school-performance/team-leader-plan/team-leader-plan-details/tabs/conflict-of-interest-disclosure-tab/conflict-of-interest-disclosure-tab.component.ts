import { Component, Input } from '@angular/core';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'conflict-of-interest-disclosure-tab',
  templateUrl: './conflict-of-interest-disclosure-tab.component.html',
  styleUrl: './conflict-of-interest-disclosure-tab.component.scss'
})
export class ConflictOfInterestDisclosureTabComponent extends BaseTabComponent {

  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;

  @Input() isEditMode: boolean = false;
}
