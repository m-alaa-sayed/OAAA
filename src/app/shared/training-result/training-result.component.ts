import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/core/services/common.service';
import { limitWords } from '../utils/word-utils';

@Component({
  selector: 'training-result',
  templateUrl: './training-result.component.html',
  styleUrl: './training-result.component.scss'
})
export class TrainingResultComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() trainingResultObj: any;
  @Input() title: any = 'PAGES.EXTERNAL_REVIEWER.LABELS.TRAINING_RESULT';
  trainingStatusOptions = [
    { value: 'PASSED_TRAINING', label: 'PASSED_TRAINING' },
    { value: 'NOT_PASSED_TRAINING', label: 'NOT_PASSED_TRAINING' }
  ];

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
    const result = limitWords(this.trainingResultObj.trainingNotes || '', 250);
    this.trainingResultObj.trainingNotes = result.trimmedText;
  }
}
