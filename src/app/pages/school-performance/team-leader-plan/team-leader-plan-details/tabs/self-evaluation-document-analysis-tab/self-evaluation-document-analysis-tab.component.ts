import { Component, Input } from '@angular/core';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'self-evaluation-document-analysis-tab',
  templateUrl: './self-evaluation-document-analysis-tab.component.html',
  styleUrl: './self-evaluation-document-analysis-tab.component.scss'
})
export class SelfEvaluationDocumentAnalysisTabComponent extends BaseTabComponent {

  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;

  @Input() isEditMode: boolean = false;

}
