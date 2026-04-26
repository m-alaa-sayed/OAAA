import { Injectable } from '@angular/core';
import { BaseWizardService } from 'src/app/shared/wizard-template/base-wizard.service';
import { SelfEvaluationDocumentUpdateRequest } from '../types/self-evaluation-document-update-request';
import { SelfEvaluationDocument } from '../types/self-evaluation-document';
import { SelfEvaluationDocumentService } from './self-evaluation-document.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { SelfEvaluationDocumentCleanerService } from 'src/app/core/services/self-evaluation-document-cleaner.service';

@Injectable({
  providedIn: 'root'
})
export class SelfEvaluationDocumentWizaredService extends BaseWizardService {

  constructor(
    private router: Router,
    private translate: TranslateService,
    private toastService: ToastService,
     private cleaner: SelfEvaluationDocumentCleanerService,
    private selfEvaluationDocumentService: SelfEvaluationDocumentService
  ) {
    super();
  }


  protected submit(formData: any) {
  }


  getCancelUrl(): string {
    return "/jawda/school-performance/self-evaluation-document/list";
  }



  saveTempSelfEvaluation(selfEvaluationDocument: SelfEvaluationDocument) {
    const cleanSelfEvaluationDocument = this.cleaner.removeAverageRows(selfEvaluationDocument);
    const request: SelfEvaluationDocumentUpdateRequest = {
      action: 'SAVE',
      selfEvaluationDocument: cleanSelfEvaluationDocument
    };
    this.selfEvaluationDocumentService.updateSelfEvaluationDocument(selfEvaluationDocument.id, request).subscribe({
      next: (response) => {
       this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
          classname: 'bg-success text-white',
          delay: 3000
        });
        // Add delay before navigation to allow user to see the success message
        setTimeout(() => {
          this.router.navigate(['/jawda/school-performance/self-evaluation-document/creation', selfEvaluationDocument.id], {
            queryParams: { reload: true }
          });
        }, 500);

      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }
}
