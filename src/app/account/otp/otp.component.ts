import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent implements OnChanges {

  @Input() resendActivationTimeInSecond !: number;

  @Output() resendOtpEventEmitter = new EventEmitter<boolean>();
  @Output() verifyOtpEventEmitter = new EventEmitter<string>();
  @Output() backToLoginEventEmitter = new EventEmitter<void>();

  otpCode: string = '';
  otpTimer: number = 0;
  intervalId: any;
  direction: any;
  config: any;



  constructor(public translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.updateConfig();
    });

    this.updateConfig();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['resendActivationTimeInSecond'].currentValue
      && changes['resendActivationTimeInSecond'].currentValue !== ''
      && this.otpTimer === 0) {
      this.activeResendOtpBtn();
    }
  }


  activeResendOtpBtn() {
    clearInterval(this.intervalId);
    this.otpTimer = this.resendActivationTimeInSecond;
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


  onOtpChange(otp: any) {
    this.otpCode = otp;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.otpCode.length === this.config.length) {
      event.preventDefault();
      this.verifyOtp();
    }
  }

  verifyOtp() {
    this.verifyOtpEventEmitter.emit(this.otpCode);
  }

  resendOtp() {
    this.resendOtpEventEmitter.emit(true);
  }

  backToLogin() {
    this.backToLoginEventEmitter.emit();
  }

}
