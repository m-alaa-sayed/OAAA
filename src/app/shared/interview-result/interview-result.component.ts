import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ExternalReviewInterviewResultInfo } from 'src/app/pages/external-reviewers/types/external-reviewers-interview-result/external-review-interview-result-info';
import { limitWords } from '../utils/word-utils';

@Component({
  selector: 'app-interview-result',
  templateUrl: './interview-result.component.html',
  styleUrl: './interview-result.component.scss'
})
export class InterviewResultComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() externalReviewInterviewResultInfo: ExternalReviewInterviewResultInfo = {} as ExternalReviewInterviewResultInfo;
  @Input() title: any = 'PAGES.EXTERNAL_REVIEWERS_INTERVIEW_RESULT.LABELS.PERSONAL_INTERVIEW_RESULT';

  constructor(private commonService: CommonService,
    public translate: TranslateService
  ) {

  }

  ngOnInit(): void {


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


  onTextChange(): void {
    const result = limitWords(this.externalReviewInterviewResultInfo.interviewNotes || '', 250);
    this.externalReviewInterviewResultInfo.interviewNotes = result.trimmedText;
  }

}
