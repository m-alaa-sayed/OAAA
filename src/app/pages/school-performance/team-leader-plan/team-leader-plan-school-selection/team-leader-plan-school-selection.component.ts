import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { TeamLeaderPlanService } from '../../service/team-leader-plan.service';
import { ScheduledSchoolVisit } from '../../types/scheduled-school-visit';

@Component({
  selector: 'team-leader-plan-school-selection',
  templateUrl: './team-leader-plan-school-selection.component.html',
  styleUrl: './team-leader-plan-school-selection.component.scss'
})
export class TeamLeaderPlanSchoolSelectionComponent {


  scheduledSchoolVisitList: ScheduledSchoolVisit[] = [];


  columns: any[] = [];
  actions: any[] = [];


  constructor(
    public translate: TranslateService,
    private router: Router,
    private teamLeaderPlanService: TeamLeaderPlanService,
    public toastService: ToastService) {
  }



  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.availableForPlanning();
  }

  private availableForPlanning(): void {
    this.teamLeaderPlanService.availableForPlanning().subscribe({
      next: (res) => this.scheduledSchoolVisitList = res.data || [],
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  //-- prepare grid cols 
  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: this.translate.currentLang === 'ar' ? 'school.nameAr' : 'school.nameEn',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.SCHOOL_NAME',

      },
      {
        field: this.translate.currentLang === 'ar' ? 'school.type' : 'school.type',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.TYPE',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.school.type);
        },

      },
      {
        field: this.translate.currentLang === 'ar' ? 'school.governorate.nameAr' : 'school.governorate.nameEn',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GOVERNORATE',
      },
      {
        field: this.translate.currentLang === 'ar' ? 'school.wilayat.nameAr' : 'school.wilayat.nameEn',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.WILAYAT',

      },
      {
        field: 'school.studentsNumber',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.NUMBER_OF_STUDENTS',

      }, {
        field: 'school.gender',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GENDER',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.school.gender);
        },

      },
      {
        field: 'school.classes',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GRADES',

      },
      {
        field: 'scheduleNumber',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.GEOGRAPHIC_LOCATION',

      }, {
        field: 'suggestedTeamSize',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.TEAM_SIZE_EXCL_LEADER',
        width: 180

      },
      {
        field: 'visitFrom',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.VISIT_PERIOD_FROM',

      },
      {
        field: 'visitTo',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.VISIT_PERIOD_TO',

      },
      {
        field: 'budgetRial',
        headerName: 'PAGES.TEAM_LEADER_PLAN.LABELS.BUDGET_OMR',
        width: 170,
        valueFormatter: (params: any) => {
          return Number(params.value).toFixed(3);
        }
      },

    ];

    this.actions = [
      {
        label: 'details',
        icon: 'ri-eye-fill',
        callback: (row: any) => this.openDetails(row)

      },
    ];
  }


  openDetails(row: any) {
    this.router.navigate(['/jawda/school-performance/team-leader-plan/creation']
      , {
        state: { scheduledSchoolVisit: row.data }
      });
  }

}
