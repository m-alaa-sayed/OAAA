import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {VisitFormService} from 'src/app/pages/school-performance/service/visit-form.service';
import {VisitFormRequestInfo} from "../../../../types/visit-form-request-info";

@Component({
    selector: 'form-visit-details',
    templateUrl: './form-visit-details.component.html',
    styleUrl: './form-visit-details.component.scss'
})
export class FormVisitDetailsComponent implements OnInit {

    @Input() visitFormRequestInfo: VisitFormRequestInfo = {} as VisitFormRequestInfo;
    @Input() visitData: any;
    @Input() grades: any;
    @Input() periods: any;
    @Input() showButtons: boolean = true;
    @Input() editable: boolean = true;
    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    subjects = ['ISLAMIC_EDUCATION', 'ARABIC', 'ENGLISH', 'MATH', 'SCIENCE', 'SOCIAL_STUDIES', 'OTHER'];
    validateDetails: boolean = true;

    constructor(
        public translate: TranslateService,
        public visitFormService: VisitFormService,
        private router: Router,
        public toastService: ToastService) {
    }


    ngOnInit(): void {

    }

    save() {
        this.visitFormService.save(this.visitFormRequestInfo);
    }

}
