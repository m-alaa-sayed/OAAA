import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'src/app/core/services/toast-service';
import {TranslateService} from '@ngx-translate/core';
import {DomainSummaryService} from '../../service/domain-summary.service';

@Component({
    selector: 'app-domain-summary-request-details',
    templateUrl: './domain-summary-request-details.component.html',
    styleUrl: './domain-summary-request-details.component.scss'
})
export class DomainSummaryRequestDetailsComponent implements OnInit {

    requestId: any;
    taskId: any = null;
    requestObject: any;
    domainSummaryRequestInfo: any;
    mainRequestData: any;
    isSubmitted: boolean = false;
    type: any;
    mode: string = "";
    isLeaderView: boolean = false;

    constructor(private route: ActivatedRoute,
                private toastService: ToastService,
                public translate: TranslateService,
                private domainSummaryService: DomainSummaryService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
        this.route.paramMap.subscribe(params => {
            this.requestId = params.get('requestId');
            this.isLeaderView = params.get('isLeaderView') === 'true';
            this.getDomainSummaryRequestInfoByRequestId(this.requestId, this.taskId);
        });

    }

    getDomainSummaryRequestInfoByRequestId(requestId: number, taskId: number) {
        this.domainSummaryService.getDomainSummaryRequestInfoByRequestId(requestId, taskId).subscribe({
            next: (response) => {
                this.domainSummaryRequestInfo = response.data.domainSummarySubmissionRequestInfo;
                this.requestObject = response.data;
                this.preparedMainRequestData();
            }, error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }

    preparedMainRequestData() {
        this.mainRequestData = {
            requestDate: this.requestObject.requestDate,
            applicationNo: this.requestObject.applicationNo,
            stepNameAr: this.requestObject.serviceStep.stepNameAr,
            stepNameEn: this.requestObject.serviceStep.stepNameEn,
            statusNameAr: this.requestObject.serviceStep.statusNameAr,
            statusNameEn: this.requestObject.serviceStep.statusNameEn,
            serviceNameAr: this.requestObject.oaaaService.serviceNameAr,
            serviceNameEn: this.requestObject.oaaaService.serviceNameEn,

        };
        this.mode = this.requestObject.serviceStep.stepCode;
    }

    showValidationMessage(message: string) {
        scrollTo(0, 0);
        this.isSubmitted = true;
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }

    submit(event: any): void {
        const sendObject = {
            requestDto: this.requestObject,
            action: event.action,
            comment: event.comment,
            taskId: this.taskId
        };
        this.domainSummaryService.completeVisitFormRequestInfo(sendObject).subscribe({
            next: (response) => {
                this.router.navigate(['/jawda/success-page'], {
                    state: {requestApplicationNo: this.requestObject.applicationNo, action: event.action}
                });
            }, error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white',
                    autohide: false
                });
            }
        });
    }
}
