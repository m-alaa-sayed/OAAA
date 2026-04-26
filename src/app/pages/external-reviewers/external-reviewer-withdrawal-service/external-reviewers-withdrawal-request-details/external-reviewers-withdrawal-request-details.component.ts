import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserClaim } from 'src/app/core/models/user-claim';
import { ExternalReviewerWithdrawalService } from '../../services/external-reviewer-withdrawal.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { ExternalReviewerSettingsService } from 'src/app/core/services/external-reviewer-settings.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExternalReviewerAttachments } from '../../types/external-reviewer-attachments';
import { ExternalReviewersWithdrawalComplete } from '../../types/external-reviewers-withdrawal-complete';
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-external-reviewers-withdrawal-request-details',
  templateUrl: './external-reviewers-withdrawal-request-details.component.html',
  styleUrl: './external-reviewers-withdrawal-request-details.component.scss'
})
export class ExternalReviewersWithdrawalRequestDetailsComponent {
  id: string | null = '';
  taskId: any = null;
  requestObject: any;
  mainRequestData: any;
  showTabs: boolean = false;
  title: string = '';

  isReturnForEdit: boolean = false;
  userClaim: UserClaim | null = null;
  isSubmitted: boolean = false;

  externalReviewerId: any;
  constructor(private route: ActivatedRoute,
    private withdrawalRequestService: ExternalReviewerWithdrawalService,
    private toastService: ToastService,
    public translate: TranslateService,
    private settingsService: ExternalReviewerSettingsService,
    private commonService: CommonService,
    private router: Router,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
    this.withdrawalRequestService.getRequestByRequestIdAndTaskId(this.id, this.taskId).subscribe({
      next: (response) => {
        this.requestObject = response.data;
        this.externalReviewerId = this.requestObject.externalReviewWithdrawInfo.externalReviewerId
        this.pageTitle();
        this.preparedMainRequestData();

        this.isReturnForEdit = this.requestObject.serviceStep.stepCode.includes('_RETURN_FOR_EDIT');
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });

  }

  pageTitle() {
    this.title = this.translate.instant('PAGES.EXTERNAL_REVIEWERS_WITHDRAW.TITLE.' + this.requestObject.oaaaService.module);
  }

  preparedMainRequestData() {
    this.mainRequestData = {
      requestDate: this.requestObject.requestDate,
      applicationNo: this.requestObject.applicationNo,
      stepNameAr: this.requestObject.serviceStep.stepNameAr,
      stepNameEn: this.requestObject.serviceStep.stepNameEn,
      statusNameAr: this.requestObject.serviceStep.statusNameAr,
      statusNameEn: this.requestObject.serviceStep.statusNameEn,
    };
  }

  updateAttchment(updatedAttachmentList: ExternalReviewerAttachments[]) {
    this.requestObject.attachmentList = updatedAttachmentList;
  }


  addAttchment(attachmentObject: ExternalReviewerAttachments) {
    if (!this.requestObject.requestAttachmentList) {
      this.requestObject.requestAttachmentList = []
    }
    this.requestObject.requestAttachmentList.push(attachmentObject);
  }



  removeAttchment(index: number) {
    this.requestObject.requestAttachmentList?.splice(index, 1);
  }



  addInfoAttchment(attachmentObject: ExternalReviewerAttachments) {
    if (!this.requestObject.externalReviewWithdrawInfo.externalReviewWithdrawAttachments) {
      this.requestObject.externalReviewWithdrawInfo.externalReviewWithdrawAttachments = []
    }
    this.requestObject.externalReviewWithdrawInfo.externalReviewWithdrawAttachments.push(attachmentObject);
  }

  removeInfoAttchment(index: number) {
    this.requestObject.externalReviewWithdrawInfo.externalReviewWithdrawAttachments?.splice(index, 1);
  }


  showValidationMessage(message: string) {
    scrollTo(0, 0);
    this.isSubmitted = true;
    this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
  }

  submit(event: any) {
    const sendObject: ExternalReviewersWithdrawalComplete = {
      requestDto: this.requestObject,
      action: event.action,
      comment: event.comment,
      taskId: this.taskId
    };
    this.withdrawalRequestService.complete(sendObject).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: this.requestObject.applicationNo, action: event.action }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  onTextChange(obj: any, field: string, value: string): void {
    const result = limitWords(value || '', 250);
    obj[field] = result.trimmedText;
  }
}
