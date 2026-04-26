import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseModal } from 'src/app/shared/base-modal';
import { ExternalReviewerDeletionRequest } from '../../types/external-reviewer-deletion-request';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-deletion-request-actions',
  templateUrl: './deletion-request-actions.component.html',
  styleUrl: './deletion-request-actions.component.scss'
})
export class DeletionRequestActionsComponent extends BaseModal {
  @Input() requestObject: ExternalReviewerDeletionRequest = {} as ExternalReviewerDeletionRequest;
  @Output() actionEventEmitter = new EventEmitter<any>();
  @Output() showErrorAndHideSpinner = new EventEmitter<string>();

  mode!: string;
  action: string | undefined;
  submitted = false;
  comment!: string;

  constructor(public route: ActivatedRoute,
    public override modalService: NgbModal,
    public toastService: ToastService,
    public translate: TranslateService,
    public router: Router

  ) {
    super(modalService);
  }

  ngOnInit(): void {
    this.mode = this.requestObject.serviceStep?.stepCode || "";
  }


  setAction(action: any, content: any, validateStatus:boolean) {
    if (validateStatus) {
      const hasInvalidStatus = this.requestObject.externalReviewerDeletionList.some(
        item => !item.deletionStatus || item.deletionStatus === ''
          || item.deletionStatus === null || item.deletionStatus === 'REMOVED_UNDER_APPROVE'
      );

      if (hasInvalidStatus) {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.PLEASE_SELECT_DELETION_STATUS'),
          { classname: 'bg-danger text-white', autohide: true, delay: 3000 }
        );
        return;
      }
    }

    this.action = action;
    if (this.handleSpecialErrorCases(action)) {
      this.comment = "";
      this.open(content);
    }
  }

  closePopup() {
    (this.comment = ''), (this.submitted = false);
    this.close();
  }

  sendAction() {
    if (!this.comment && (this.action == 'RETURN_FOR_EDIT' || this.action == 'REJECT')) {
      this.submitted = true;
    } else {
      this.close();
      this.actionEventEmitter.emit({ comment: this.comment, action: this.action })
    }
  }

  returnToList() {
    this.close();
    this.router.navigate(['/jawda/service-management/service-catalogue-list']);
  }

  handleSpecialErrorCases(event: any): boolean {
    let isRequestValid = true;

    return isRequestValid;
  }

  onTextChange(): void {
    const result = limitWords(this.comment || '', 250);
    this.comment = result.trimmedText;
  }
}



