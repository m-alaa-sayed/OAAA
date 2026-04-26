import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { AccountRoutingModule } from './account-routing.module';
import { SigninModule } from "./auth/signin/signin.module";
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { PersonalInfoStepComponent } from './create-account/components/personal-info-step/personal-info-step.component';
import { OtpStepComponent } from './create-account/components/otp-step/otp-step.component';
import { EmailInfoStepComponent } from './create-account/components/email-info-step/email-info-step.component';
import { CreateAccountComponent } from './create-account/pages/create-account/create-account.component';
import { SuccessPageComponent } from './success-page/success-page.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    OtpComponent,
    CreateAccountComponent,
    PersonalInfoStepComponent,
    OtpStepComponent,
    EmailInfoStepComponent,
    SuccessPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AccountRoutingModule,
    SigninModule,
    NgbToastModule,
    NgOtpInputModule,
    TranslateModule,
    SharedModule,
    LayoutsModule,
    NgSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { }
