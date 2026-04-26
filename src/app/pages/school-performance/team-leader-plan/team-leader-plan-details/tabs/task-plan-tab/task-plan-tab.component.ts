import { Component, Input } from '@angular/core';
import { ReviewTeamAssignmentRequestInfo } from 'src/app/pages/school-performance/types/review-team-assignment-request-info';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'task-plan-tab',
  templateUrl: './task-plan-tab.component.html',
  styleUrl: './task-plan-tab.component.scss'
})
export class TaskPlanTabComponent extends BaseTabComponent {

  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
  @Input() reviewTeamAssignmentRequestInfoList: ReviewTeamAssignmentRequestInfo[] = [];


  @Input() isEditMode: boolean = false;

}
