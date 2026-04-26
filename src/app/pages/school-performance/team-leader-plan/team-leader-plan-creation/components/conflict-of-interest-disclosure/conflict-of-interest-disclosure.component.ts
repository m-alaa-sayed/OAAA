import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { TeamLeaderPlanWizaredService } from 'src/app/pages/school-performance/service/team-leader-plan-wizared.service';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';

@Component({
  selector: 'conflict-of-interest-disclosure',
  templateUrl: './conflict-of-interest-disclosure.component.html',
  styleUrl: './conflict-of-interest-disclosure.component.scss'
})
export class ConflictOfInterestDisclosureComponent implements OnInit {


  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
  @Input() showButtons: boolean = true;
  @Input() isEditMode: boolean = false;



  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  isSubmitted = false;

  constructor(
    public translate: TranslateService,
    private toastService: ToastService,
    public teamLeaderPlanWizaredService: TeamLeaderPlanWizaredService) {
  }

  ngOnInit(): void {
    if (!this.visitPlanRequestInfo.reviewTeamAssignments) {
      this.visitPlanRequestInfo.reviewTeamAssignments = [];
    }
  }

  onCheckBoxChanged(event: any, conflict: any) {
    if (!event.target.checked) {
      conflict.conflictReason = '';
    }
  }


  next() {
    this.isSubmitted = true;
    const hasConflictWithoutReason =
      this.visitPlanRequestInfo?.reviewTeamAssignments?.some(c => c.hasConflict && (!c.conflictReason || c.conflictReason.trim() === ''));

    if (hasConflictWithoutReason) {
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.ADD_REASON'),
        {
          classname: 'bg-danger text-white',
            autohide: false
        }
      );
      return;
    }
    this.nextEvent.emit();
  }


  save() {
    this.teamLeaderPlanWizaredService.saveTempObject(this.visitPlanRequestInfo, 'SAVE');
  }

}
