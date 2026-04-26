import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OtpValidationRequest } from 'src/app/account/model/otp-validation-request';
import { RegistrationCompletionRequestDto } from 'src/app/account/model/registration-completion-request-dto';
import { RegistrationInitiationRequest } from 'src/app/account/model/registration-initiation-request';
import { RegistrationInitiationResponse } from 'src/app/account/model/registration-initiation-response';
import { CreateAccountWizardService } from 'src/app/core/services/create-account-wizard.service';
import { CreateAccountService } from 'src/app/core/services/create-account.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-otp-step',
  templateUrl: './otp-step.component.html',
  styleUrl: './otp-step.component.scss'
})
export class OtpStepComponent extends BaseStepComponent implements OnInit {

  @Input() registrationCompletionRequestDto !: RegistrationCompletionRequestDto;

  registrationInitiationResponse = {} as RegistrationInitiationResponse;
  registrationInitiationRequest = {} as RegistrationInitiationRequest;
  otpCode: string = '';
  otpTimer: number = 0;
  direction: any;
  config: any;
  intervalId: any;
  resendOtpTimerInSeconds !: number;

  isNewEmail: boolean = true;



  constructor(public createAccountWizardService: CreateAccountWizardService,
    protected override router: Router,
    public translate: TranslateService,
    private createAccountService: CreateAccountService,
    private toastService: ToastService
  ) {
    super(createAccountWizardService, router);
    this.translate.onLangChange.subscribe(() => {
      this.updateConfig();
    });

    this.updateConfig();
  }

  ngOnInit(): void {
    this.registrationInitiationRequest.email = this.registrationCompletionRequestDto.email;
    this.initiateRegistration();
  }

  updateConfig() {
    const currentLang = this.translate.currentLang;
    // Always use LTR direction for OTP input
    this.direction = 'ltr';

    this.config = {
      allowNumbersOnly: true,
      length: 4,
      isPasswordInput: false,
      disableAutoFocus: false,
      placeholder: '',
      inputClass: 'otp-input',
      inputStyles: {
        'width': '80px',
        'height': '50px'
      }
    };

  }

  onOtpChange(otp: any) {
    this.otpCode = otp;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.otpCode.length === this.config.length) {
      event.preventDefault();
      this.verifyOtp();
    }
  }

  //--- init otp
  initiateRegistration() {
    this.createAccountService.initiateRegistration(this.registrationInitiationRequest).subscribe({
      next: (res) => {
        this.registrationInitiationResponse = res.data;
        this.activeResendOtpBtn();
      },
      error: (error) => {
        if (error === 'EMAIL_ALREADY_EXISTS')
          this.isNewEmail = false;
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-warning text-white', delay: 3000 });
      }
    });
  }

  private activeResendOtpBtn() {
    clearInterval(this.intervalId);
    this.otpTimer = this.registrationInitiationResponse.resendOtpTimerInSeconds ?? 0;
    if (this.otpTimer > 0) {
      this.intervalId = setInterval(() => {
        if (this.otpTimer > 0) {
          this.otpTimer--;
        } else {
          clearInterval(this.intervalId);
        }
      }, 1000);
    }
  }


  verifyOtp() {
    const otpValidationRequest = {
      email: this.registrationCompletionRequestDto.email,
      otp: Number(this.otpCode)
    } as OtpValidationRequest;
    this.createAccountService.validateOtp(otpValidationRequest).subscribe({
      next: (res) => {
        this.next();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
        if (error === 'OTP_MAX_FAILURE_ATTEMPTS') {
          void this.router.navigate(['/jawda/dashboard']);
        }
      }
    });
  }

  resendOtp() {
    this.createAccountService.resendOtp(this.registrationInitiationRequest).subscribe({
      next: (res) => {
        if (res.data) {
          this.registrationInitiationResponse = res.data;
          this.activeResendOtpBtn();
        }
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }
}
