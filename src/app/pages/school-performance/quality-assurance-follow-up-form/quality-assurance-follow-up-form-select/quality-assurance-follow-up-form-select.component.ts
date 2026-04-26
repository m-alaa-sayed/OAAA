import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { QualityAssuranceFollowUpFormService } from '../../service/quality-assurance-follow-up-form.service';

@Component({
  selector: 'app-quality-assurance-follow-up-form-select',
  templateUrl: './quality-assurance-follow-up-form-select.component.html',
  styleUrl: './quality-assurance-follow-up-form-select.component.scss'
})
export class QualityAssuranceFollowUpFormSelectComponent implements OnInit {
  visitData: any;
  id: any;
  type: any;
  columns: any[] = [];
  actions: any[] = [];
  list: any[] = [];
  navigateParam: any;

  constructor(
    public translate: TranslateService,
    private router: Router,
    public toastService: ToastService,
    private route: ActivatedRoute,
    private qualityAssuranceFormService: QualityAssuranceFollowUpFormService) {

  }


  ngOnInit(): void {
    this.getQualityAssuranceFormVisits();
    this.prepareGridHeaderCols();
  }

  getQualityAssuranceFormVisits(): void {
    this.qualityAssuranceFormService.getScheduledSchoolVisits().subscribe({
      next: (res) => this.list = res.data || [],
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  private prepareGridHeaderCols() {
    this.columns = [
      {
        field: 'selfEvaluationDocumentNumber',
        headerName: 'PAGES.VISIT_FORM.LABELS.SELF_EVALUATION_DOCUMENT_NUMBER',

      },
      {
        field: this.translate.currentLang === 'ar' ? 'school.nameAr' : 'school.nameEn',
        headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_NAME',

      },
      {
        field: 'school.type',
        headerName: 'PAGES.VISIT_FORM.LABELS.SCHOOL_TYPE',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.school.type);
        }
      },
      {
        field: this.translate.currentLang === 'ar' ? 'school.governorate.nameAr' : 'school.governorate.nameEn',
        headerName: 'PAGES.VISIT_FORM.LABELS.GOVERNORATE',

      },
      {
        field: this.translate.currentLang === 'ar' ? 'school.wilayat.nameAr' : 'school.wilayat.nameEn',
        headerName: 'PAGES.VISIT_FORM.LABELS.WILAYAH',

      },
      {
        field: 'school.studentsNumber',
        headerName: 'PAGES.VISIT_FORM.LABELS.NUMBER_OF_STUDENTS',

      },
      {
        field: 'school.gender',
        headerName: 'PAGES.VISIT_FORM.LABELS.GENDER',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.school.gender.toUpperCase());
        }
      },
      {
        field: 'school.classes',
        headerName: 'PAGES.VISIT_FORM.LABELS.GRADES',

      },
      {
        field: 'visitNumber',
        headerName: 'PAGES.VISIT_FORM.LABELS.SCHEDULE_NUMBER',

      },
      {
        field: 'planNumber',
        headerName: 'PAGES.VISIT_FORM.LABELS.PLAN_NUMBER',
      },
      {
        field: 'visitFrom',
        headerName: 'PAGES.QUALITY_ASSURANCE.LABELS.VISIT_FROM',

      },
      {
        field: 'visitTo',
        headerName: 'PAGES.QUALITY_ASSURANCE.LABELS.VISIT_TO',

      },
      {
        field: 'visitStatus',
        headerName: 'PAGES.QUALITY_ASSURANCE.LABELS.VISIT_STATUS',
        valueGetter: (params: any) => {
          return this.translate.instant('PAGES.COMMON.LABELS.' + params.data.visitStatus.toUpperCase());
        }

      }
    ];

    this.actions = [
      {
        label: 'select',
        icon: 'ri-radio-button-fill',
        callback: (row: any) => this.open(row)
      }
    ];
  }

  open(row: any) {
    this.router.navigate(['/jawda/school-performance/quality-assurance-form/creation',row.data.id],
      { state: { visitData: this.qualityAssuranceFormService.prepareVisitData(row.data) } });

  }

}
