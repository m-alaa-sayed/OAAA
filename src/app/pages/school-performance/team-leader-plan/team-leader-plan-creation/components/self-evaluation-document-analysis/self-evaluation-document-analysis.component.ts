import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { TeamLeaderPlanWizaredService } from 'src/app/pages/school-performance/service/team-leader-plan-wizared.service';
import { TeamleadCohortTrackingComponent } from 'src/app/pages/school-performance/tabs/teamlead-cohort-tracking/teamlead-cohort-tracking.component';
import { SchoolInfo } from 'src/app/pages/school-performance/types/school-info';
import { VisitPlanRequestInfo } from 'src/app/pages/school-performance/types/visit-plan-request-info';

@Component({
  selector: 'self-evaluation-document-analysis',
  templateUrl: './self-evaluation-document-analysis.component.html',
  styleUrl: './self-evaluation-document-analysis.component.scss'
})
export class SelfEvaluationDocumentAnalysisComponent implements OnInit {

  @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;

  @Input() showButtons: boolean = true;
  @Input() isEditMode: boolean = false;


  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  submitted = false;



  activeTab: string = 'mastery-rates';


  tabs = [
    {
      id: 'mastery-rates',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.MASTERY_RATES',
    },
    {
      id: 'achievement-distribution',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.ACHIEVEMENT_DISTRIBUTION',
    },
    {
      id: 'teamlead-cohort-tracking',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.COHORT_TRACKING',
    }
  ];


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public teamLeaderPlanWizaredService: TeamLeaderPlanWizaredService,
    public translate: TranslateService,
    private toastService: ToastService,
  ) { }


  ngOnInit(): void {
    if (!this.visitPlanRequestInfo.editableSchoolInfo) {
      this.visitPlanRequestInfo.editableSchoolInfo = {} as SchoolInfo;
    }
  }


  selectTab(tab: any): void {
    scrollTo(0, 0);
    this.activeTab = tab.id;
    this.router.navigate([tab.route], { relativeTo: this.route });
  }


  save() {
    this.teamLeaderPlanWizaredService.saveTempObject(this.visitPlanRequestInfo, 'SAVE');
  }

  next() {
    this.nextEvent.emit();
  }
}

