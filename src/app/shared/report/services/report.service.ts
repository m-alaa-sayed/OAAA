import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {ToastService} from "../../../core/services/toast-service";
import {map} from "rxjs";
import {AppConstants} from "../../../core/constants/app-constants";
import {AppResponse} from "../../../core/models/app-response";
import {ReportDto} from "../dto/report.dto";


@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private http: HttpClient, public translate: TranslateService,
                private router: Router,
                private toastService: ToastService) {
    }

    getReports(module: string | null) {
        const url = `${AppConstants.API.REPORTS}get-reports/${module}/`;
        return this.http.get<AppResponse<ReportDto[]>>(url).pipe(map((ret) => ret.data));
    }

    downloadExcelReport(requestBody: any) {
        return this.http.post<AppResponse<any>>(`${AppConstants.API.REPORTS}generate-xlsx/`, requestBody);
    }
}