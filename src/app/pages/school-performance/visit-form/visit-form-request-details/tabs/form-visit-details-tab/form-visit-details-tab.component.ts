import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {VisitFormWizardService} from 'src/app/pages/school-performance/service/visit-form-wizard.service';
import {
    ActivityTypesEnum,
    GradeEnum,
    PeriodEnum,
    SubjectEnum
} from 'src/app/pages/school-performance/types/education.enums';
import {VisitFormRequestInfo} from 'src/app/pages/school-performance/types/visit-form-request-info';
import {BaseTabComponent} from 'src/app/shared/tabs-template/base-tab.component';

@Component({
    selector: 'form-visit-details-tab',
    templateUrl: './form-visit-details-tab.component.html',
    styleUrl: './form-visit-details-tab.component.scss'
})
export class FormVisitDetailsTabComponent extends BaseTabComponent {
    @Input() visitFormRequestInfo !: VisitFormRequestInfo;
    @Input() visitData: any;

    grades = Object.values(GradeEnum);
    periods = Object.values(PeriodEnum);
    activityTypes = Object.values(ActivityTypesEnum);
}
