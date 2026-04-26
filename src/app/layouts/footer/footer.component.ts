import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../core/services/common.service";
import {AppResponse} from "../../core/models/app-response";
import {AppConstants} from "../../core/constants/app-constants";
import {HttpClient} from "@angular/common/http";
import {ToastService} from "../../core/services/toast-service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-layout-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    bucketName: string = 'oaaaqa';
    objectName: string = 'TermsAndConditions.pdf';
    // set the currenr year
    year: number = new Date().getFullYear();


    constructor(public commonService: CommonService, private http: HttpClient, public toastService: ToastService, public translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    downloadTermsAndConditions() {
        this.http.get<AppResponse<any>>(`${AppConstants.API.TERMS_AND_CONDITIONS}`).subscribe({
            next: (response => {
                const contentType = 'application/pdf';
                const dataUri = 'data:' + contentType + ';base64,' + response.data.file;
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = dataUri;
                a.download = response.data.fileName;
                a.click();
                window.URL.revokeObjectURL(dataUri);
            }),
            error: (err) => this.handleError(err)
        });
    }

    public handleError(error: any) {
        let message = 'PAGES.COMMON.MESSAGES.';
        message += error;
        // }
        this.toastService.show(this.translate.instant(message), {
            classname: 'bg-danger text-white',
            autohide: false
        });
    }
}
