import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { BaseModal } from 'src/app/shared/base-modal';
import { limitWords } from 'src/app/shared/utils/word-utils';


@Component({
  selector: 'external-reviewers-withdrawal-request-actions',
  templateUrl: './external-reviewers-withdrawal-request-actions.component.html',
  styleUrl: './external-reviewers-withdrawal-request-actions.component.scss'
})
export class ExternalReviewersWithdrawalRequestActionsComponent extends BaseModal {
  @Input() requestObject: any;
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
    this.mode = this.requestObject.serviceStep.stepCode;
  }

  setAction(action: any, content: any) {
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
    const { stepCode } = this.requestObject.serviceStep;
    if (stepCode.includes('_ER_ERW_RETURN_FOR_EDIT')
      && (!this.requestObject.externalReviewWithdrawInfo.withdrawJustification
        || this.requestObject.externalReviewWithdrawInfo.withdrawJustification.trim() === '')) {
      this.showErrorAndHideSpinner.emit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS');
      isRequestValid = false;
    } else if (stepCode.includes('_DME_ERW_UNDER_REVIEW') && this.action != 'RETURN_FOR_EDIT'
      && (!this.requestObject.externalReviewWithdrawInfo?.dataManagementEmployerRecommendation ||
        !this.requestObject?.externalReviewWithdrawInfo?.dataManagementEmployerRecommendation ||
        !this.requestObject.externalReviewWithdrawInfo?.dataManagementEmployerRecommendationNotes ||
        !this.requestObject?.externalReviewWithdrawInfo?.dataManagementEmployerRecommendationNotes)) {
      this.showErrorAndHideSpinner.emit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS');
      isRequestValid = false;
    }
    else if (stepCode.includes('_SDM_ERW_UNDER_REVIEW') && this.action != 'RETURN_FOR_EDIT'
      && (!this.requestObject.externalReviewWithdrawInfo?.supportDepartmentManagerRecommendation ||
        !this.requestObject?.externalReviewWithdrawInfo?.supportDepartmentManagerRecommendation ||
        !this.requestObject.externalReviewWithdrawInfo?.supportDepartmentManagerRecommendationNotes ||
        !this.requestObject?.externalReviewWithdrawInfo?.supportDepartmentManagerRecommendationNotes)) {
      this.showErrorAndHideSpinner.emit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS');
      isRequestValid = false;
    }
    return isRequestValid;
  }


  onTextChange(): void {
    const result = limitWords(this.comment || '', 250);
    this.comment = result.trimmedText;
  }
}
