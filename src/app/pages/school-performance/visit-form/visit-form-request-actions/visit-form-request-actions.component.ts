import { Component, Input, EventEmitter, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { BaseModal } from 'src/app/shared/base-modal';
import { VisitFormService } from '../../service/visit-form.service';
import { Permission } from 'src/app/core/enum/permission';

@Component({
  selector: 'visit-form-request-actions',
  templateUrl: './visit-form-request-actions.component.html',
  styleUrl: './visit-form-request-actions.component.scss'
})
export class VisitFormRequestActionsComponent extends BaseModal {
  @Input() visitFormRequestInfo: any;
  @Output() actionEventEmitter = new EventEmitter<any>();
  @Output() showErrorAndHideSpinner = new EventEmitter<string>();
  @Input() mode!: string;
  @Input() taskId!: any;
  
  action: string | undefined;
  submitted = false;
  comment!: string;
  protected readonly Permission = Permission;

  constructor(public route: ActivatedRoute,
    public override modalService: NgbModal,
    public toastService: ToastService,
    public visitFormService: VisitFormService,
    public translate: TranslateService,
    public router: Router

  ) {
    super(modalService);
  }
  ngOnInit(): void {
    
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
    this.router.navigate(['/jawda/service-management/service-catalogue-list']);
  }

  handleSpecialErrorCases(event: any): boolean {
    if (!this.visitFormService.validateVisitFormRequestInfoMandatoryFields(this.visitFormRequestInfo)) {
     return false
    }
    return true;
  }
}

