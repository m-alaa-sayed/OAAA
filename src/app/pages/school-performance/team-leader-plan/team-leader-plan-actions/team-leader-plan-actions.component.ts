import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { BaseModal } from 'src/app/shared/base-modal';
import { ServiceStep } from 'src/app/shared/types/service-step';
import { TeamLeaderPlanWizaredService } from '../../service/team-leader-plan-wizared.service';

@Component({
  selector: 'team-leader-plan-actions',
  templateUrl: './team-leader-plan-actions.component.html',
  styleUrl: './team-leader-plan-actions.component.scss'
})
export class TeamLeaderPlanActionsComponent extends BaseModal {

  @Input() requestObject: any;
  @Output() actionEventEmitter = new EventEmitter<any>();
  @Output() validationEventEmitter = new EventEmitter<boolean>(false);
  @Input()taskId:any;
  mode!: ServiceStep;
  action: string | undefined;
  submitted = false;
  comment!: string;

  constructor(public route: ActivatedRoute,
    public override modalService: NgbModal,
    public toastService: ToastService,
    public teamLeaderPlanWizaredService:TeamLeaderPlanWizaredService,
    public translate: TranslateService,
    public router: Router  ) {
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
        const {stepCode} = this.requestObject.serviceStep;
        if (!this.teamLeaderPlanWizaredService.validateAllDomainsSelected(this.requestObject.visitPlanRequestInfoDto)) {
            return false;
        }
        return true;
    }

  private showErrorMessageAndEmit(message: string) {
    this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
  }

  saveBtn() {
    this.teamLeaderPlanWizaredService.saveTempObject(this.requestObject.visitPlanRequestInfoDto, 'SAVE',this.taskId);
  }

}
