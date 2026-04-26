import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
    selector: 'visit-details',
    templateUrl: './visit-details.component.html',
    styleUrl: './visit-details.component.scss'
})
export class VisitDetailsComponent implements OnInit {

    @Input() visitData: any;

    constructor(
        public translate: TranslateService,
        private router: Router,
        public toastService: ToastService) {
    }

    ngOnInit(): void {
    }
}
