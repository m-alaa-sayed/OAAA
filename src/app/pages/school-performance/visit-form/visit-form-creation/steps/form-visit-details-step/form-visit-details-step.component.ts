import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {VisitFormWizardService} from 'src/app/pages/school-performance/service/visit-form-wizard.service';
import {ActivityTypesEnum, GradeEnum, PeriodEnum} from 'src/app/pages/school-performance/types/education.enums';
import {VisitFormRequestInfo} from 'src/app/pages/school-performance/types/visit-form-request-info';
import {BaseStepComponent} from 'src/app/shared/wizard-template/base-step.component';

@Component({
    selector: 'form-visit-details-step',
    templateUrl: './form-visit-details-step.component.html',
    styleUrl: './form-visit-details-step.component.scss'
})
export class FormVisitDetailsStepComponent extends BaseStepComponent {
    @Input() visitFormRequestInfo: VisitFormRequestInfo = {} as VisitFormRequestInfo;
    @Input() visitData: any;

    grades = Object.values(GradeEnum);
    periods = Object.values(PeriodEnum);
    activityTypes = Object.values(ActivityTypesEnum);

    constructor(public visitFormWizardService: VisitFormWizardService,
                protected override router: Router) {
        super(visitFormWizardService, router);
    }


    cancelBtn(type: any) {
        this.router.navigate(['/jawda/school-performance/visit-form/' + type + '/list']);
    }
}
