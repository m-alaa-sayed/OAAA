import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {VisitFormWizardService} from 'src/app/pages/school-performance/service/visit-form-wizard.service';
import {VisitFormRequestInfo} from 'src/app/pages/school-performance/types/visit-form-request-info';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';

@Component({
    selector: 'performance-evaluation-step',
    templateUrl: './performance-evaluation-step.component.html',
    styleUrl: './performance-evaluation-step.component.scss'
})
export class PerformanceEvaluationStepComponent extends BaseStepComponent {
    @Input() visitFormRequestInfo: VisitFormRequestInfo = {} as VisitFormRequestInfo;

    constructor(public visitFormWizardService: VisitFormWizardService,
                protected override router: Router) {
        super(visitFormWizardService, router);
    }

    cancelBtn(type: any) {
        this.router.navigate(['/jawda/school-performance/visit-form/' + type + '/list']);
    }
}
