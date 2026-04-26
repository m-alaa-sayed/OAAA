import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ExternalReviewerSettingDto} from "../../../types/external-reviewer-setting.dto";
import {ExternalReviewersRegistrationRequestInfo} from '../../../types/external-reviewers-registration-request-info';
import {TranslateService} from '@ngx-translate/core';
import {ExternalReviewerRegistrationService} from '../../../services/external-reviewer-registration.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewersRegistrationRequest} from '../../../types/external-reviewers-registration-request';
import {BaseModal} from 'src/app/shared/base-modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  styleUrl: './pledge.component.scss'
})
export class PledgeComponent extends BaseModal {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;

  @Input() externalReviewerSettingDto: ExternalReviewerSettingDto = new ExternalReviewerSettingDto();
  @Input() showButtons: boolean = true;

  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();


  constructor(public translate: TranslateService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService,
    private toastService: ToastService,
    private router: Router,
    public override modalService: NgbModal
  ) {
    super(modalService);
  }





  submit() {
    this.close();
    this.externalReviewersRegistrationRequestInfo.externalReviewersRegistrationSettingsId = this.externalReviewerSettingDto.id;
    const externalReviewersRegistrationRequest: ExternalReviewersRegistrationRequest = {
      externalReviewersRegistrationRequestInfo: this.externalReviewersRegistrationRequestInfo
    }
    this.externalReviewerRegistrationService.createRequest(this.externalReviewersRegistrationRequestInfo.serviceCode, externalReviewersRegistrationRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: response.data, action: 'SUBMIT' }
        });
      },
      error: (err) => {
        const msgKey = err?.error?.errorMessage || 'PAGES.COMMON.MESSAGES.UNKNOWN_ERROR';
        this.toastService.show(this.translate.instant(msgKey), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


}
