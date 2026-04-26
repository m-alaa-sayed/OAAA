import { Component, Input } from '@angular/core';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'qa-visit-details-tab',
  templateUrl: './visit-details-tab.component.html',
  styleUrl: './visit-details-tab.component.scss'
})
export class QAVisitDetailsTabComponent extends BaseTabComponent {
  @Input() qualityAssuranceFormInfo: any = {};
  @Input() visitData: any;
  @Input() scheduledSchoolVisitId: any;

}
