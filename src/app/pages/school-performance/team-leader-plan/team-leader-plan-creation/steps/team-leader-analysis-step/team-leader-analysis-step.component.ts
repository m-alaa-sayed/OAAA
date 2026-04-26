import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TeamLeaderPlanWizaredService } from 'src/app/pages/school-performance/service/team-leader-plan-wizared.service';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'team-leader-analysis-step',
  templateUrl: './team-leader-analysis-step.component.html',
  styleUrl: './team-leader-analysis-step.component.scss'
})
export class TeamLeaderAnalysisStepComponent extends BaseStepComponent {

  @Input() isEditMode: boolean = false;
  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;

  constructor(public teamLeaderPlanWizaredService: TeamLeaderPlanWizaredService,
    protected override router: Router) {
    super(teamLeaderPlanWizaredService, router);
  }
}
