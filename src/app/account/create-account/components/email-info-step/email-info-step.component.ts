import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegistrationCompletionRequestDto } from 'src/app/account/model/registration-completion-request-dto';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { CreateAccountWizardService } from 'src/app/core/services/create-account-wizard.service';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-email-info-step',
  templateUrl: './email-info-step.component.html',
  styleUrl: './email-info-step.component.scss'
})
export class EmailInfoStepComponent extends BaseStepComponent implements OnInit{

  @Input() registrationCompletionRequestDto !: RegistrationCompletionRequestDto ;

  isSubmitting : boolean = false;

  EMAIL_PATTERN : any = AppConstants.PATTERNS.EMAIL;  
  constructor(public createAccountWizardService: CreateAccountWizardService,
    public translate: TranslateService,
    protected override router: Router
  ) {
    super(createAccountWizardService, router);
    
  }
  ngOnInit(): void {
    console.log(this.registrationCompletionRequestDto);
  }

}
