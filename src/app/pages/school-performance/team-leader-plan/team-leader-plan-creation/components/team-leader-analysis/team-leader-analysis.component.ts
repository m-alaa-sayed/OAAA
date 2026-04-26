import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { TeamLeaderPlanWizaredService } from 'src/app/pages/school-performance/service/team-leader-plan-wizared.service';
import { TeamLeaderPlanService } from 'src/app/pages/school-performance/service/team-leader-plan.service';
import { VisitPlanLeaderAnalyses } from 'src/app/pages/school-performance/types/visit-plan-leader-analyses';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';
import { BaseModal } from 'src/app/shared/base-modal';

@Component({
  selector: 'team-leader-analysis',
  templateUrl: './team-leader-analysis.component.html',
  styleUrl: './team-leader-analysis.component.scss'
})
export class TeamLeaderAnalysisComponent extends BaseModal implements OnInit {


  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
  @Input() showButtons: boolean = true;
  @Input() isEditMode: boolean = false;


  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  @ViewChild("submitForm") submitForm?: NgForm;

  isSubmitting = false;

  constructor(
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    private teamLeaderPlanService: TeamLeaderPlanService,
    public teamLeaderPlanWizaredService: TeamLeaderPlanWizaredService,
    public override modalService: NgbModal
  ) {
    super(modalService);
  }

  ngOnInit(): void {
    if (!this.visitPlanRequestInfo.leaderAnalyses) {
      this.visitPlanRequestInfo.leaderAnalyses = {} as VisitPlanLeaderAnalyses;
    }
  }


  validateForm(content: any) {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), { classname: 'bg-danger text-white', autohide: false });
      scrollTo(0, 0);
      return
    }
    this.open(content);
  }


  submit() {
    this.close();
    const visitPlanCreationRequestDto: any = {
      action: 'SUBMIT',
      visitPlanRequestInfoDto: this.visitPlanRequestInfo
    };
    this.teamLeaderPlanService.handleVisitPlanRequest(visitPlanCreationRequestDto).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: response.data.request.applicationNo, action: 'SUBMIT' }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });

  }

  saveBtn() {
    this.teamLeaderPlanWizaredService.saveTempObject(this.visitPlanRequestInfo, 'SAVE');
  }
}
