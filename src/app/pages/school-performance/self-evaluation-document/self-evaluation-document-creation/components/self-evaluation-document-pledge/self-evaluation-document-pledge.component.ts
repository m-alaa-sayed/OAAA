import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SelfEvaluationDocument } from 'src/app/pages/school-performance/types/self-evaluation-document';
import { SelfEvaluationDocumentSetting } from 'src/app/pages/school-performance/types/self-evaluation-document-setting';

@Component({
  selector: 'self-evaluation-document-pledge',
  templateUrl: './self-evaluation-document-pledge.component.html',
  styleUrl: './self-evaluation-document-pledge.component.scss'
})
export class SelfEvaluationDocumentPledgeComponent implements OnInit {

  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
  @Input() selfEvaluationDocumentSetting: SelfEvaluationDocumentSetting = {} as SelfEvaluationDocumentSetting;


  @Input() showButtons: boolean = true;

  @Output() nextEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();

  isEditable: boolean = false;



  constructor(
    public translate: TranslateService) {
  }


  ngOnInit(): void {
    this.isEditable = this.selfEvaluationDocument.status != 'SUBMITTED';
  }
}
