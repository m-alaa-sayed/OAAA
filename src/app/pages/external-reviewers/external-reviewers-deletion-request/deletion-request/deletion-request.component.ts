import { Component, OnInit } from '@angular/core';
import { ExternalReviewersRegistrationRequest } from '../../types/external-reviewers-registration-request';
import { ExternalReviewerDeletionRequest } from '../../types/external-reviewer-deletion-request';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ExternalReviewersDeletionService } from '../../services/external-reviewers-deletion.service';
import { ExternalReviewerDeletion } from '../../types/ExternalReviewerDeletion';
import { ExternalReviewersDeletionComplete } from '../../types/external-reviewers-deletion-complete';
import { RequestAttachment } from 'src/app/shared/types/request-attachment';
import { limitWords } from 'src/app/shared/utils/word-utils';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-deletion-request',
  templateUrl: './deletion-request.component.html',
  styleUrl: './deletion-request.component.scss'
})
export class DeletionRequestComponent implements OnInit {

  externalReviewersList: any[] = [];
  id: string | null = '';
  taskId: any = null;
  requestObject: ExternalReviewerDeletionRequest = {} as ExternalReviewerDeletionRequest;
  mainRequestData: any;
  title: string = '';
  showChildComponent: boolean = false;
  module: string = "";
  constructor(private route: ActivatedRoute,
    private toastService: ToastService,
    private authService: AuthService,
    public translate: TranslateService,
    private commonService: CommonService,
    private router: Router,
    private externalReviewersDeletionService: ExternalReviewersDeletionService
  ) {
  }

  ngOnInit(): void {    
    this.id = this.route.snapshot.paramMap.get('id');
    this.taskId = this.route.snapshot.paramMap.get('taskId') || null;

    this.externalReviewersDeletionService.getRequestByRequestIdAndTaskId(this.id, this.taskId).subscribe({
      next: (response) => {
        this.requestObject = response.data;
        this.showChildComponent = true;
        this.module = this.requestObject.oaaaService?.module!;
        this.preparedMainRequestData();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  preparedMainRequestData() {
    this.mainRequestData = {
      requestDate: this.requestObject.requestDate,
      applicationNo: this.requestObject.applicationNo,
      stepNameAr: this.requestObject.serviceStep?.stepNameAr,
      stepNameEn: this.requestObject.serviceStep?.stepNameEn,
      statusNameAr: this.requestObject.serviceStep?.statusNameAr,
      statusNameEn: this.requestObject.serviceStep?.statusNameEn,
    };
  }


  updateErDeletionResultList(completeRowData: ExternalReviewerDeletion) {
    this.requestObject.externalReviewerDeletionList = [
      ...(this.requestObject.externalReviewerDeletionList || []),
      completeRowData
    ];
  }

  submit(event: any) {
    const sendObject: ExternalReviewersDeletionComplete = {
      externalReviewerDeletionRequestDto: this.requestObject,
      action: event.action,
      comment: event.comment,
      taskId: this.taskId
    };
    this.externalReviewersDeletionService.complete(sendObject).subscribe({
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



  addAttchment(attachmentObject: RequestAttachment) {
    if (!this.requestObject.requestAttachmentList) {
      this.requestObject.requestAttachmentList = []
    }
    this.requestObject.requestAttachmentList.push(attachmentObject);
  }



  removeAttchment(index: number) {
    this.requestObject.requestAttachmentList?.splice(index, 1);
  }

  onTextChange(): void {
    const result = limitWords(this.requestObject.notes || '', 250);
    this.requestObject.notes = result.trimmedText;
  }
}
