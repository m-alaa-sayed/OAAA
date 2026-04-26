import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from 'src/app/core/services/common.service';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewersTrainingService} from '../../services/external-reviewers-training.service';
import { ExternalReviewerRegistrationService } from '../../services/external-reviewer-registration.service';
import {ExternalReviewerTrainingResultRequest} from '../../types/external-reviewer-training-result-request';
import {ExternalReviewersTrainingResultsComplete} from '../../types/external-reviewers-training-results-complete';
import {ExternalReviewerTrainingResult} from '../../types/ExternalReviewerTrainingResult';
import {ExternalReviewersRegistrationRequest} from '../../types/external-reviewers-registration-request';
import {RequestAttachment} from 'src/app/shared/types/request-attachment';
import {limitWords} from 'src/app/shared/utils/word-utils';
import { ExternalReviewersTrainingResultTableComponent } from '../external-reviewers-training-result-table/external-reviewers-training-result-table.component';

@Component({
  selector: 'app-training-results-request',
  templateUrl: './training-results-request.component.html',
  styleUrl: './training-results-request.component.scss'
})
export class TrainingResultsRequestComponent implements OnInit {

  module: 'CHEQA' | 'CSEQA' | 'OQF' | null = null;
  externalReviewersRegistrationRequestList: ExternalReviewersRegistrationRequest[] = [];
  id: string | null = '';
  taskId: any = null;
  requestObject: ExternalReviewerTrainingResultRequest = {} as ExternalReviewerTrainingResultRequest;
  mainRequestData: any;
  title: string = '';
  showChildComponent: boolean = false;
  erActivities: SystemLookupDto[] = [];
  criterionList: any[] = [];

  trainingStatusOptions = [
    { value: 'PASSED_TRAINING', label: 'PASSED_TRAINING' },
    { value: 'NOT_PASSED_TRAINING', label: 'NOT_PASSED_TRAINING' }
  ];

  constructor(private route: ActivatedRoute,
    private toastService: ToastService,
    public translate: TranslateService,
    private commonService: CommonService,
    private router: Router,
    private externalReviewersTrainingService: ExternalReviewersTrainingService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService
  ) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.taskId = this.route.snapshot.paramMap.get('taskId') || null;

    this.externalReviewersTrainingService.getRequestByRequestIdAndTaskId(this.id, this.taskId).subscribe({
      next: (response) => {
        this.requestObject = response.data;
        const moduleValue = this.requestObject?.oaaaService?.module;
        this.module = (moduleValue === 'CHEQA' || moduleValue === 'CSEQA' || moduleValue === 'OQF') ? moduleValue : null;
        this.showChildComponent = true;
        this.preparedMainRequestData();
      },
      error: (error) => {
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
      stepNameAr: this.requestObject.serviceStep?.stepNameAr,
      stepNameEn: this.requestObject.serviceStep?.stepNameEn,
      statusNameAr: this.requestObject.serviceStep?.statusNameAr,
      statusNameEn: this.requestObject.serviceStep?.statusNameEn,
    };
  }


  downloadUploadedFile(objectName: any, bucketName: any): void {
    if (!objectName || !bucketName) {
      console.warn('Missing file data');
      return;
    }

    this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
      .subscribe({
        next: (res) => {
          const downloadUrl = res.data;

          fetch(downloadUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('File download failed.');
              }
              return response.blob();
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = objectName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            })
            .catch(err => {
              console.error('Download via blob failed:', err);
            });
        },
        error: (err) => {
          console.error('Download failed:', err);
        }
      });
  }


  updateErtraninigResultList(completeRowData: ExternalReviewerTrainingResult) {
    this.requestObject.externalReviewerTrainingResultList = [
      ...(this.requestObject.externalReviewerTrainingResultList || []),
      completeRowData
    ];
  }

  @ViewChild(ExternalReviewersTrainingResultTableComponent)
  trainingResultTable!: ExternalReviewersTrainingResultTableComponent;

  submit(event: any) {
    const check = this.trainingResultTable?.validateRequiredJustifications();
    if (check && !check.valid) {
      console.error('Justification is required for rows:', check.invalidIndexes);
      // const rows = check.invalidIndexes.map(i => i + 1).join(', ');
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.JUSTIFICATION_REQUIRED'), {
        classname: 'bg-danger text-white',
        delay: 5000,
        autohide: true
      });
      return; // stop submission
    }


    const sendObject: ExternalReviewersTrainingResultsComplete = {
      externalReviewerTrainingResultRequestDto: this.requestObject,
      action: event.action,
      comment: event.comment,
      taskId: this.taskId
    };
    this.externalReviewersTrainingService.complete(sendObject).subscribe({
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

  /**
   * Called by child actions component before opening approve/return modal.
   * Returns true when it's OK to proceed (valid), false to block and show toast.
   */
  validateBeforeAction(): boolean {
    const check = this.trainingResultTable?.validateRequiredJustifications();
    if (check && !check.valid) {
      console.error('Justification is required for rows:', check.invalidIndexes);
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.JUSTIFICATION_REQUIRED'), {
        classname: 'bg-danger text-white',
        delay: 5000,
        autohide: true
      });
      return false;
    }
    return true;
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
