import { Component, Input } from '@angular/core';
import { VisitFormRequestInfo } from 'src/app/pages/school-performance/types/visit-form-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'performance-evaluation-tab',
  templateUrl: './performance-evaluation-tab.component.html',
  styleUrl: './performance-evaluation-tab.component.scss'
})
export class PerformanceEvaluationTabComponent extends BaseTabComponent{
  @Input() visitFormRequestInfo !: VisitFormRequestInfo;
  @Input() isReturnForEdit:boolean = false;
    @Input() isTeamMember: boolean = true;
}
