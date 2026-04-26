import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast-service';
import { QualityAssuranceFollowUpFormWizardService } from 'src/app/pages/school-performance/service/quality-assurance-follow-up-form-wizard.service';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-during-after-visit-tab',
  templateUrl: './during-after-visit-tab.component.html',
  styleUrl: './during-after-visit-tab.component.scss'
})
export class DuringAfterVisitTabComponent extends BaseStepComponent {
  @Input() qualityAssuranceFormInfo: any = {} as any;

  constructor(public qualityAssuranceFormService: QualityAssuranceFollowUpFormWizardService,
    public toastService: ToastService,
    protected override router: Router) {
    super(qualityAssuranceFormService, router);
  }

  
}
