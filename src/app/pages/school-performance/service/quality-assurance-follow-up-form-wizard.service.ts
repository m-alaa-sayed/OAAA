import { Injectable } from '@angular/core';
import { BaseWizardService } from 'src/app/shared/wizard-template/base-wizard.service';

@Injectable({
  providedIn: 'root'
})
export class QualityAssuranceFollowUpFormWizardService extends BaseWizardService {

  constructor() {
    super();
  }


  protected submit(formData: any) {
  }


  getCancelUrl(): string {
    return "/jawda/school-performance/quality-assurance-form/list";
  }
}

