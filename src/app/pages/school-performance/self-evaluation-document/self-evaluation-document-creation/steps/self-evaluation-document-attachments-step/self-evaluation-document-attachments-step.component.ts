import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SelfEvaluationDocumentWizaredService } from 'src/app/pages/school-performance/service/self-evaluation-document-wizared.service';
import { SelfEvaluationDocument } from 'src/app/pages/school-performance/types/self-evaluation-document';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'self-evaluation-document-attachments-step',
  templateUrl: './self-evaluation-document-attachments-step.component.html',
  styleUrl: './self-evaluation-document-attachments-step.component.scss'
})
export class SelfEvaluationDocumentAttachmentsStepComponent extends BaseStepComponent {

  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;


  constructor(public selfEvaluationDocumentWizaredService: SelfEvaluationDocumentWizaredService,
    protected override router: Router) {
    super(selfEvaluationDocumentWizaredService, router);
  }




}
