import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TeamLeaderPlanWizaredService } from 'src/app/pages/school-performance/service/team-leader-plan-wizared.service';
import { ReviewTeamAssignmentRequestInfo } from 'src/app/pages/school-performance/types/review-team-assignment-request-info';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'task-plan-step',
  templateUrl: './task-plan-step.component.html',
  styleUrl: './task-plan-step.component.scss'
})
export class TaskPlanStepComponent extends BaseStepComponent {

  @Input() isEditMode: boolean = false;
  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
  @Input() reviewTeamAssignmentRequestInfoList: ReviewTeamAssignmentRequestInfo[] = [];

  constructor(public teamLeaderPlanWizaredService: TeamLeaderPlanWizaredService,
    protected override router: Router) {
    super(teamLeaderPlanWizaredService, router);
  }
}
