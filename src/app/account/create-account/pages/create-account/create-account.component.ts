import { Component, OnInit } from '@angular/core';
import { StepItem } from 'src/app/shared/wizard-template/step-item';
import { PersonalInfoStepComponent } from '../../components/personal-info-step/personal-info-step.component';
import { OtpStepComponent } from '../../components/otp-step/otp-step.component';
import { EmailInfoStepComponent } from '../../components/email-info-step/email-info-step.component';
import { RegistrationCompletionRequestDto } from 'src/app/account/model/registration-completion-request-dto';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {

  registrationCompletionRequestDto?: RegistrationCompletionRequestDto = {} as RegistrationCompletionRequestDto;
  wizardStepsInputs = new Map<string, any>();


  ngOnInit(): void {
    scrollTo(0, 0);
    this.wizardStepsInputs.set('registrationCompletionRequestDto', this.registrationCompletionRequestDto);
  }

  steps: StepItem[] = [
    {
      labelAr: 'بيانات البريد الإلكتروني',
      labelEn: 'Email Info',
      component: EmailInfoStepComponent,
      inputs: this.wizardStepsInputs
    },
    {
      labelAr: 'التحقق من البيانات',
      labelEn: 'OTP',
      component: OtpStepComponent,
      inputs: this.wizardStepsInputs
    },
    {
      labelAr: 'البيانات الشخصية',
      labelEn: 'Personal Info',
      component: PersonalInfoStepComponent,
      inputs: this.wizardStepsInputs
    }
  ];

}
