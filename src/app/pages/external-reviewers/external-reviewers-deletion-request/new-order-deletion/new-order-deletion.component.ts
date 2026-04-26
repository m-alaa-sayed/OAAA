import { Component, OnInit } from '@angular/core';
import { BaseModal } from 'src/app/shared/base-modal';
import { ExternalReviewersRegistrationRequest } from '../../types/external-reviewers-registration-request';
import { ExternalReviewerDeletion } from '../../types/ExternalReviewerDeletion';
import { ExternalReviewerDeletionCreate } from '../../types/external-reviewer-deletion-create';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast-service';
import { ExternalReviewersDeletionService } from '../../services/external-reviewers-deletion.service';
import { getDeletionServiceCodeByModule } from 'src/app/shared/utils/module-service-map';
import { RequestAttachment } from 'src/app/shared/types/request-attachment';
import { limitWords } from 'src/app/shared/utils/word-utils';
import { ExternalReviewer } from '../../types/external-reviewer';

@Component({
  selector: 'app-new-order-deletion',
  templateUrl: './new-order-deletion.component.html',
  styleUrl: './new-order-deletion.component.scss'
})
export class NewOrderDeletionComponent extends BaseModal implements OnInit {

  externalReviewersList: ExternalReviewer[] = [];

  filteredExternalReviewersList: ExternalReviewer[] = [];
  externalReviewerDeletionList: ExternalReviewerDeletion[] = [];

  externalReviewerDeletionCreate: ExternalReviewerDeletionCreate = {} as ExternalReviewerDeletionCreate;


  serviceCode: string = "";
  module: string = "";

  columns: any[] = [];
  actions: any;
  showGridTable: boolean = false;
  generalNotes: string = '';

  constructor(
    public override modalService: NgbModal,
    public translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private externalReviewersDeletionService: ExternalReviewersDeletionService
  ) {
    super(modalService);
    this.module = this.route.snapshot.paramMap.get('module') || '';
    this.serviceCode = getDeletionServiceCodeByModule(this.module) || "";
  }

  ngOnInit(): void {
    this.getEligibleExternalReviewers();
  }


  private getEligibleExternalReviewers() {
    this.externalReviewersDeletionService.getEligibleExternalReviewers(this.module).subscribe({
      next: (response) => {
        this.externalReviewersList = response.data;
        this.showGridTable = true;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  updateErDeletionResultList(completeRowData: ExternalReviewerDeletion) {
    this.externalReviewerDeletionList = [
      ...(this.externalReviewerDeletionList || []),
      completeRowData
    ];

    this.filteredExternalReviewersList =
      this.externalReviewersList?.filter(externalReviewer =>
        !this.externalReviewerDeletionList?.some(result =>
          result.externalReviewerId === externalReviewer?.id
        )
      );
  }


  deleteDeletionResult(deletedRowData: ExternalReviewerDeletion) {
    this.externalReviewerDeletionList = this.externalReviewerDeletionList.filter(
      item => item.externalReviewerId != deletedRowData.externalReviewerId
    );

    this.filteredExternalReviewersList =
      this.externalReviewersList?.filter(externalReviewer =>
        !this.externalReviewerDeletionList?.some(result =>
          result.externalReviewerId === externalReviewer?.id
        )
      );

  }


  cancel(): void {
    this.router.navigate(['/jawda/external-reviewers-deletion/training-results']);
  }


validateForm(content: any) {
  const hasEmptyDeletionNotes = this.externalReviewerDeletionList.some(
    row => !row.deletionNotes || row.deletionNotes.trim() === ''
  );

  if (hasEmptyDeletionNotes) {
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_JUSTIFICATIONS'), { classname: 'bg-danger text-white', autohide: false });
    scrollTo(0, 0);
    return;
  }

  this.open(content);
}

  createRequest() {
    this.externalReviewerDeletionCreate.externalReviewerDeletionDtoList = this.externalReviewerDeletionList;
    this.close();
    this.externalReviewersDeletionService.createRequest(this.serviceCode, this.externalReviewerDeletionCreate).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: response.data, action: 'SUBMIT' }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  addAttchment(attachmentObject: RequestAttachment) {
    if (!this.externalReviewerDeletionCreate.requestAttachmentList) {
      this.externalReviewerDeletionCreate.requestAttachmentList = []
    }
    this.externalReviewerDeletionCreate.requestAttachmentList.push(attachmentObject);
  }



  removeAttchment(index: number) {
    this.externalReviewerDeletionCreate.requestAttachmentList?.splice(index, 1);
  }

  onTextChange(): void {
    const result = limitWords(this.externalReviewerDeletionCreate.requestNotes || '', 250);
    this.externalReviewerDeletionCreate.requestNotes = result.trimmedText;
  }
}

