import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExternalReviewersRegistrationRequest } from '../../../types/external-reviewers-registration-request';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { ExternalReviewerDeletion } from '../../../types/ExternalReviewerDeletion';
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'deletion-details-model',
  templateUrl: './deletion-details-model.component.html',
  styleUrl: './deletion-details-model.component.scss'
})
export class DeletionDetailsModelComponent {
  @ViewChild("submitForm") submitForm?: NgForm;

  @Input() rowData: any = {} as any;
  @Input() title: string = 'PAGES.ER_DELETION.LABELS.DELETION_REQUEST_DETAILS';

  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() declineEvent: EventEmitter<any> = new EventEmitter<any>();

  notes: string = '';
  isSubmitting: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService
  ) {
   }


  submit(): void {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      return;
    }

    // Create the complete data object that will be added to the second grid
    const completeRowData: ExternalReviewerDeletion = {
      requestId: this.rowData.id,
      externalReviewer: this.rowData,
      externalReviewerId: this.rowData?.id,
      deletionNotes: this.notes,
    };


    this.confirmEvent.emit(completeRowData);
    this.activeModal.close(completeRowData);
  }


  cancel(): void {
    this.declineEvent.emit();
    this.activeModal.dismiss('cancel');
  }


    onTextChange(): void {
      const result = limitWords(this.notes || '', 250);
      this.notes = result.trimmedText;
    }
}

