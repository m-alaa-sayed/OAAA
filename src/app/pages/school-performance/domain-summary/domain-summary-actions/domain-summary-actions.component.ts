import { Component, Input,EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { BaseModal } from 'src/app/shared/base-modal';
import { DomainSummaryService } from '../../service/domain-summary.service';

@Component({
  selector: 'domain-summary-actions',
  templateUrl: './domain-summary-actions.component.html',
  styleUrl: './domain-summary-actions.component.scss'
})
export class DomainSummaryActionsComponent extends BaseModal {
  @Input() domainSummaryRequestInfo: any;
  @Input() requestObject!: any;
  @Output() actionEventEmitter = new EventEmitter<any>();
  @Output() showErrorAndHideSpinner = new EventEmitter<string>();
  @Input() taskId!: any;
  
  action: string | undefined;
  submitted = false;
  comment!: string;
  mode!: string;

  constructor(public route: ActivatedRoute,
    public override modalService: NgbModal,
    public toastService: ToastService,
    public domainSummaryService: DomainSummaryService,
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
    if(this.action =='SAVE' || this.handleSpecialErrorCases(action)){
      this.comment = "";
      this.open(content);
    }
  }

  closePopup() {
    (this.comment = ''), (this.submitted = false);
    this.close();
  }

  sendAction() {
    if (!this.comment && (this.action == 'RETURN_FOR_EDIT')) {
      this.submitted = true;
    } else {
      this.close();
      this.actionEventEmitter.emit({ comment: this.comment, action: this.action })
    }
  }

  returnToList() {
    this.close();
    this.router.navigate(['/jawda/user-tasks/user-tasks-list']);
  }

  handleSpecialErrorCases(event: any): boolean {
    if (!this.domainSummaryService.validateDomainSummaryRequestInfoMandatoryFields(this.domainSummaryRequestInfo)) {
      this.showErrorAndHideSpinner.emit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT');
     return false
    }
    return true;
  }


}


