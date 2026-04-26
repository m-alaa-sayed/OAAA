import { Component, Input } from '@angular/core';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'app-experience-information-tab',
  templateUrl: './experience-information-tab.component.html',
  styleUrl: './experience-information-tab.component.scss'
})
export class ExperienceInformationTabComponent extends BaseTabComponent {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() isEditMode: boolean = false;


}
