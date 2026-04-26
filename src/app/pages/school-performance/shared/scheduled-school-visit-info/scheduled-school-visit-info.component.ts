import {Component, Input} from '@angular/core';
import {ScheduledSchoolVisit} from "../../types/scheduled-school-visit";
import {TranslateService} from "@ngx-translate/core";
import {LanguageUtil} from "../../../../core/util/language.util";

@Component({
    selector: 'app-scheduled-school-visit-info',
    templateUrl: './scheduled-school-visit-info.component.html',
    styleUrl: './scheduled-school-visit-info.component.scss'
})
export class ScheduledSchoolVisitInfoComponent {

    @Input() scheduledSchoolVisit: ScheduledSchoolVisit = {} as ScheduledSchoolVisit;

    constructor(
        public translate: TranslateService) {
    }

    protected readonly LanguageUtil = LanguageUtil;
}
