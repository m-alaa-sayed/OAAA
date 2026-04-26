import { Component, Input } from '@angular/core';
import { VisitFormRequestInfo } from 'src/app/pages/school-performance/types/visit-form-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'strengths-improvement-analysis-tab',
  templateUrl: './strengths-improvement-analysis-tab.component.html',
  styleUrl: './strengths-improvement-analysis-tab.component.scss'
})
export class StrengthsImprovementAnalysisTabComponent extends BaseTabComponent{
  @Input() visitFormRequestInfo !: VisitFormRequestInfo;
  @Input() canEdit:boolean = false;

}
