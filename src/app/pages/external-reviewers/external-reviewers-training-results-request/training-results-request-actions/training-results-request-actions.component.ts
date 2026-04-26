import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { BaseModal } from 'src/app/shared/base-modal';
import { ExternalReviewerTrainingResultRequest } from '../../types/external-reviewer-training-result-request';
import { limitWords } from 'src/app/shared/utils/word-utils';
import { Permission } from 'src/app/core/enum/permission';

@Component({
  selector: 'app-training-results-request-actions',
  templateUrl: './training-results-request-actions.component.html',
  styleUrl: './training-results-request-actions.component.scss'
})
export class TrainingResultsRequestActionsComponent extends BaseModal {
  readonly Permission = Permission; 
  // @Input() serviceStep!: any;
  @Input() requestObject: ExternalReviewerTrainingResultRequest = {} as ExternalReviewerTrainingResultRequest;
  @Input() validateAction?: () => boolean;
  @Output() actionEventEmitter = new EventEmitter<any>();
  @Output() showErrorAndHideSpinner = new EventEmitter<string>();

  mode!: string;
  module: 'CSEQA' | 'CHEQA' | 'OQF' = 'CSEQA';
  permissionCompleteTask!: Permission;
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
    
    // Extract module from mode (e.g., 'CSEQA_ERTR_UNDER_APPROVE' -> 'CSEQA')
    if (this.mode.startsWith('CSEQA')) {
      this.module = 'CSEQA';
    } else if (this.mode.startsWith('CHEQA')) {
      this.module = 'CHEQA';
    } else if (this.mode.startsWith('OQF')) {
      this.module = 'OQF';
    }

    console.log('Determined module:', this.module, 'from mode:', this.mode);
    // Set permission based on module
    this.permissionCompleteTask = 
      this.module === 'CSEQA' ? Permission.CSEQA_ER_Training_results_Registration_Request_COMPLETE_TASK : 
      this.module === 'CHEQA' ? Permission.CHEQA_ER_Training_results_Registration_Request_COMPLETE_TASK : 
      Permission.OQF_ER_Training_results_Registration_Request_COMPLETE_TASK;
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

    // For actions that require the training result table validation (approve/return for edit),
    // call the parent-provided validation callback if available. If it returns false, block the modal.
    if ((event === 'APPROVE' || event === 'RETURN_FOR_EDIT') && this.validateAction) {
      try {
        isRequestValid = !!this.validateAction();
      } catch (e) {
        // If validation throws for any reason, treat as invalid and emit an error if needed
        console.error('Validation callback threw an error', e);
        isRequestValid = false;
      }
    }

    return isRequestValid;
  }

  onTextChange(): void {
    const result = limitWords(this.comment || '', 250);
    this.comment = result.trimmedText;
  }
}


