import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {SelfEvaluationDocumentService} from '../../service/self-evaluation-document.service';
import {SelfEvaluationDocument} from '../../types/self-evaluation-document';
import { Permission } from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'self-evaluation-document-list',
  templateUrl: './self-evaluation-document-list.component.html',
  styleUrl: './self-evaluation-document-list.component.scss'
})
export class SelfEvaluationDocumentListComponent implements OnInit {

  protected readonly Permission = Permission;
  //--- dumy data for grid 
  selfEvaluationDocumentList: SelfEvaluationDocument[] = [];


  columns: any[] = [];
  actions: any[] = [];



  constructor(
    public translate: TranslateService,
    private router: Router,
    public toastService: ToastService,
    private authService: AuthService,
    private selfEvaluationDocumentService: SelfEvaluationDocumentService) {
  }



  ngOnInit(): void {
    this.prepareGridHeaderCols();
    this.getSelfEvaluationDocumentList();
  }



  getSelfEvaluationDocumentList(): void {
    this.selfEvaluationDocumentService.getSelfEvaluationDocumentList().subscribe({
      next: (res) => this.selfEvaluationDocumentList = res.data || [],
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  //-- prepare grid cols 
  private prepareGridHeaderCols() {
    const userPermissions = this.authService.getUserClaim()?.permissions ?? [];
    
    this.columns = [
      {
        field: 'documentNumber',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.DOCUMENT_NUMBER',

      },
      {
        field: this.translate.currentLang === 'ar' ? 'scheduledSchoolVisit.school.nameAr' : 'scheduledSchoolVisit.school.nameEn',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.SCHOOL_NAME',

      },
      {
        field: 'scheduledSchoolVisit.school.type',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.SCHOOL_TYPE',
        valueGetter: (params: any) => {
          const schoolType = params.data?.scheduledSchoolVisit?.school?.type;
          return schoolType ? this.translate.instant(`PAGES.COMMON.LABELS.${schoolType}`) : '';
        }
      },
      {
        field: this.translate.currentLang === 'ar' ? 'scheduledSchoolVisit.school.governorate.nameAr' : 'scheduledSchoolVisit.school.governorate.nameEn',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.GOVERNORATE',

      },
      {
        field: this.translate.currentLang === 'ar' ? 'scheduledSchoolVisit.school.wilayat.nameAr' : 'scheduledSchoolVisit.school.wilayat.nameEn',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.WILAYAH',

      },
      {
        field: 'scheduledSchoolVisit.school.studentsNumber',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.NUMBER_OF_STUDENTS',

      }, {
        field: 'scheduledSchoolVisit.school.gender',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.GENDER',
        valueGetter: (params: any) => {
          const gender = params.data?.scheduledSchoolVisit?.school?.gender;
          return gender ? this.translate.instant(`PAGES.COMMON.LABELS.${gender.toUpperCase()}`) : '';
        }
      },
      {
        field: 'scheduledSchoolVisit.school.classes',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.GRADES',
        width:250

      },
      {
        field: 'scheduledSchoolVisit.schoolSchedulingRequestInfo.request.applicationNo',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.SCHEDULE_NUMBER',

      },
      {
        field: this.translate.currentLang === 'ar' ? 'userSubmitted.fullNameAr' : 'userSubmitted.fullNameEn',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.DOCUMENT_SUBMITTER',

      },
      {
        field: 'submissionDate',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.SUBMISSION_DATE',

      },
      {
        field: 'status',
        headerName: 'PAGES.SELF_EVALUATION_DOCUMENT.LABELS.STATUS',
        valueGetter: (params: any) => {
          const status = params.data?.status;
          return status ? this.translate.instant(`PAGES.COMMON.LABELS.${status.toUpperCase()}`) : '';
        }
      },

    ];

    this.actions = [
      {
        label: this.translate.instant('PAGES.COMMON.LABELS.DETAILS'),
        icon: 'ri-eye-fill',
        callback: (row: any) => this.openDetails(row),
        show: () => userPermissions.includes(Permission.SELF_EVALUATION_DOCUMENT_VIEW_DETAILS),

      },
    ];
  }



  openDetails(row: any) {
    this.router.navigate(['/jawda/school-performance/self-evaluation-document/creation', row.data.id]);
  }
}
