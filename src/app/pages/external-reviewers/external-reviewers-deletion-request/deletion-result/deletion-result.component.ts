import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from 'src/app/core/enum/permission';
import { ToastService } from 'src/app/core/services/toast-service';
import { getDeletionServiceCodeByModule } from 'src/app/shared/utils/module-service-map';
import { ExternalReviewerDeletionRequest } from '../../types/external-reviewer-deletion-request';
import { ExternalReviewersDeletionService } from '../../services/external-reviewers-deletion.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-deletion-result',
  templateUrl: './deletion-result.component.html',
  styleUrl: './deletion-result.component.scss'
})
export class DeletionResultComponent implements OnInit {
  protected readonly Permission = Permission;

  externalReviewerDeletionRequestList: ExternalReviewerDeletionRequest[] = [];
  columns: any[] = [];
  actions: any;
  serviceCode: string = "";
  module: string = "";

  permissionErDeletionRequestCreateRequest!: Permission;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private externalReviewersDeletionService: ExternalReviewersDeletionService
  ) {
    this.module = this.route.snapshot.paramMap.get('module') || '';
    this.serviceCode = getDeletionServiceCodeByModule(this.module) || "";
  }

  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.getPreviousRequest();

    this.permissionErDeletionRequestCreateRequest = 
      this.module == 'CHEQA' ? Permission.CHEQA_ER_Deletion_Request_CREATE_REQUEST : 
      Permission.OQF_ER_Deletion_Request_CREATE_REQUEST;
  }

  private prepareGridHeaderCols() {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];

    this.columns = [
      {
        field: 'applicationNo',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICATION_NO',
        cellStyle: { textAlign: 'center' },
        width: 250
      },
      {
        field: 'requestDate',
        headerName: 'PAGES.SEVERVICE_MANAGEMENT.LABELS.REQUEST_DATE',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'applicantUser.fullNameAr',
        headerName: 'PAGES.USER_TASKS.LABELS.APPLICANT_USER',
        cellStyle: { textAlign: 'center' },
        width: 200
      },
      {
        field: 'applicantUser.email',
        headerName: 'PAGES.COMMON.LABELS.EMAIL',
        cellStyle: { textAlign: 'center' },
          width: 200
      },
      {
        field: 'externalReviewerDeletionList.length',
        headerName: 'PAGES.ER_DELETION.LABELS.NUMBER_OF_DELETED',
        cellStyle: { textAlign: 'center' }
      },
      {
        field: this.translate.currentLang == 'ar' ? 'serviceStep.stepNameAr' : 'serviceStep.stepNameEn',
        headerName: 'PAGES.COMMON.LABELS.STATUS',
        cellStyle: { textAlign: 'center' }
      }
    ];

    this.actions = [
      { 
        label: 'تفاصيل', 
        icon: 'ri-eye-fill', 
        callback: (row: any) => this.openDetails(row, 'view'),
        show: () =>  
          this.module == 'CHEQA' ? userPermissions.includes(Permission.CHEQA_ER_Deletion_Request_VIEW) : 
          this.module == 'OQF' ? userPermissions.includes(Permission.OQF_ER_Deletion_Request_VIEW) : false
      }
    ];
  }

  private getPreviousRequest() {
    this.externalReviewersDeletionService.getPreviousRequest(this.serviceCode).subscribe({
      next: (response) => {
        this.externalReviewerDeletionRequestList = response.data;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  openDetails(row: any, mode: string) {
   this.router.navigate(['/jawda/external-reviewers/external-reviewers-deletion/request-details', row.data.id]);
  }

  navigateToNewOrder() {
    this.router.navigate(['/jawda/external-reviewers/external-reviewers-deletion/new-order-deletion', this.module]);
  }
}
