import { Component, Input } from '@angular/core';
import { ExternalReviewerSettingDto } from 'src/app/pages/external-reviewers/types/external-reviewer-setting.dto';
import { ExternalReviewersRegistrationRequestInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-registration-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'app-pledge-tab',
  templateUrl: './pledge-tab.component.html',
  styleUrl: './pledge-tab.component.scss'
})
export class PledgeTabComponent extends BaseTabComponent {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() externalReviewerSettingDto: ExternalReviewerSettingDto = new ExternalReviewerSettingDto();
  
}
