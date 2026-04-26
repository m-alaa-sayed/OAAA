import { Component, OnInit } from '@angular/core';
import {
  ExternalReviewersRegistrationRequestService
} from "../../../core/services/external-reviewers-registration-request.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { OaaaServiceDto } from '../types/oaaa-service-dto';
import { AppConstants } from 'src/app/core/constants/app-constants';

@Component({
  selector: 'app-previous-request',
  templateUrl: './service-previous-request-list.component.html',
  styleUrl: './service-previous-request-list.component.scss'
})
export class ServicePreviousRequestListComponent implements OnInit {
  private serviceCode: string | null = null;
  previousTransactionList: any[] = [];
  columns: any[] = [];
  actions: any;
  serviceNameAr : string | null = null;
  serviceNameEn : string | null = null;
  title = '';
  constructor(
    private registrationRequestService: ExternalReviewersRegistrationRequestService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.prepareGridHeaderCols();
  }

  ngOnInit(): void {
    this.serviceCode = this.route.snapshot.paramMap.get('serviceCode');
    this.serviceNameAr = this.route.snapshot.paramMap.get('serviceNameAr');
    this.serviceNameEn = this.route.snapshot.paramMap.get('serviceNameEn');
    let serviceName =  this.translate.currentLang == 'en' ? this.serviceNameEn : this.serviceNameAr;
    this.title = this.translate.instant('PAGES.SERVICE_CATALOGUE.LABELS.PREVIOUS_TRANSACTION') 
          + ' (' + serviceName + ')';
    if (this.serviceCode) {
      this.registrationRequestService.getPreviousRequest(this.serviceCode).subscribe({
        next: (response) => {
          this.previousTransactionList = response.data;
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
        }
      });
    }
  }

  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: 'applicationNo', headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.APPLICATION_NO',
        cellStyle: { textAlign: 'center' },
        width: 400
      },
      {
        field: 'requestDate', headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.REQUEST_DATE',
        cellStyle: { textAlign: 'center' },
        width: 360
      },
      {
        field: this.translate.currentLang === 'en' ? 'serviceStep.stepNameEn' : 'serviceStep.stepNameAr', headerName: 'PAGES.COMMON.LABELS.STATUS',
        cellStyle: { textAlign: 'center' },
        width: 310
      }
    ];

    this.actions = [
      { label: 'details', icon: 'ri-eye-fill', callback: (row: OaaaServiceDto) => this.openDetails(row, 'view') }
    ];
  }

  openDetails(row: any, mode: string) {
    const serviceCode = row.data.oaaaService.serviceCode;
    this.router.navigate([AppConstants.SERVICE_REQUEST_DETAILS[serviceCode as keyof typeof AppConstants.SERVICE_REQUEST_DETAILS], row.data.id]);
  }

}






