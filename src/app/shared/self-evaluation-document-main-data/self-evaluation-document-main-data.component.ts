import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'self-evaluation-document-main-data',
  templateUrl: './self-evaluation-document-main-data.component.html',
  styleUrl: './self-evaluation-document-main-data.component.scss'
})
export class SelfEvaluationDocumentMainDataComponent {

  @Input() selfEvalMainData: any;

  constructor(public translate: TranslateService) { }
}
