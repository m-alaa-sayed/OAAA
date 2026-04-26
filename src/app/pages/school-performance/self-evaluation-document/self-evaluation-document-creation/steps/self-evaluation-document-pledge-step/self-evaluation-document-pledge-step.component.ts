import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelfEvaluationDocumentWizaredService } from 'src/app/pages/school-performance/service/self-evaluation-document-wizared.service';
import { SelfEvaluationDocument } from 'src/app/pages/school-performance/types/self-evaluation-document';
import { SelfEvaluationDocumentSetting } from 'src/app/pages/school-performance/types/self-evaluation-document-setting';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'self-evaluation-document-pledge-step',
  templateUrl: './self-evaluation-document-pledge-step.component.html',
  styleUrl: './self-evaluation-document-pledge-step.component.scss'
})
export class SelfEvaluationDocumentPledgeStepComponent extends BaseStepComponent {

  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
  @Input() selfEvaluationDocumentSetting: SelfEvaluationDocumentSetting = {} as SelfEvaluationDocumentSetting;


  constructor(public selfEvaluationDocumentWizaredService: SelfEvaluationDocumentWizaredService,
    protected override router: Router) {
    super(selfEvaluationDocumentWizaredService, router);
  }
}
