import { Injectable } from '@angular/core';
import { BaseWizardService } from 'src/app/shared/wizard-template/base-wizard.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerRegistrationWizardService  extends BaseWizardService {

  constructor() {
    super();
  }


  protected submit(formData: any) {
  }


  getCancelUrl(): string {
    return "/jawda/service-management/service-catalogue-list";
  }
}
