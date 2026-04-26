import { Component, Input } from '@angular/core';
import { Criterion } from 'src/app/pages/external-reviewers/types/acceptance-criteria/criterion';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'app-initial-criteria-tab',
  templateUrl: './initial-criteria-tab.component.html',
  styleUrl: './initial-criteria-tab.component.scss'
})
export class InitialCriteriaTabComponent extends BaseTabComponent {

  @Input() isEditMode: boolean = false;
  @Input() criterionList: Criterion[] = [];
  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() onCriteriaValueChanged?: () => void;


}
