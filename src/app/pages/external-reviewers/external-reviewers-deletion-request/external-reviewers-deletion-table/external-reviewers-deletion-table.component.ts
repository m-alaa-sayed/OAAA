import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseModal } from 'src/app/shared/base-modal';
import { limitWords } from 'src/app/shared/utils/word-utils';
import { ExternalReviewerDeletion } from '../../types/ExternalReviewerDeletion';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/core/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'external-reviewers-deletion-table',
  templateUrl: './external-reviewers-deletion-table.component.html',
  styleUrl: './external-reviewers-deletion-table.component.scss'
})
export class ExternalReviewersDeletionTableComponent extends BaseModal {

    @Input() externalReviewerDeletionList: ExternalReviewerDeletion[] = [];

    @Input() module: string = "";

    @Input() isEditMode: boolean = true;

    @Input() isGMEditMode: boolean = false;

    @Input() canDelete: boolean = true;

    selectedFile: File | null = null;

    currentDeletionStatusOptions: any[] = [
        {value: 'REMOVED', label: 'REMOVED'},
        {value: 'NOT_REMOVED', label: 'NOT_REMOVED'}
    ];

    @Output() deleteEventEmitter = new EventEmitter<ExternalReviewerDeletion>();

    
    constructor(
        public translate: TranslateService,
        private commonService: CommonService,
        public override modalService: NgbModal,
        private toastService: ToastService
    ) {
        super(modalService);
    }

    ngOnInit() {
    }


    deleteResult(row: any) {
        const modalRef = this.modalService.open(ModalConfirmComponent, {
            backdrop: 'static',
            keyboard: false,
            size: 'sm',
            windowClass: 'with-backdrop'
        });

        modalRef.componentInstance.title = 'حذف السجل';
        modalRef.componentInstance.message = 'هل أنت متأكد من حذف هذا السجل؟';

        modalRef.componentInstance.confirmEvent.subscribe(() => {

            this.deleteEventEmitter.emit(row);
        
        });

        modalRef.componentInstance.declineEvent.subscribe(() => {
            console.log('Modal cancelled');
        });
    }


    onTextChange(deletionNotes: string): void {
        const result = limitWords(deletionNotes || '', 250);
        deletionNotes = result.trimmedText;
    }

}

