import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from 'src/app/core/services/toast-service';
import {TranslateService} from '@ngx-translate/core';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {
    ExternalReviewersRegistrationRequestService
} from 'src/app/core/services/external-reviewers-registration-request.service';
import {forkJoin} from 'rxjs';
import {CountryDto} from 'src/app/core/models/country-dto';
import {CityDto} from 'src/app/core/models/city-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {CommonService} from 'src/app/core/services/common.service';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {BroadField} from '../types/broad-field';
import {ExternalReviewerManagementService} from '../services/external-reviewer-management.service';
import {ExternalReviewerRegistrationService} from '../services/external-reviewer-registration.service';
import {
    PersonalInfoTabComponent
} from '../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/personal-info-tab/personal-info-tab.component';
import {
    QualaficationsAndSkillsTabComponent
} from '../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/qualafications-and-skills-tab/qualafications-and-skills-tab.component';
import {
    ExperienceInformationTabComponent
} from '../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/experience-information-tab/experience-information-tab.component';
import {
    ExternalReviewInterviewResultInfo
} from '../types/external-reviewers-interview-result/external-review-interview-result-info';
import {GeneralSpecialization} from '../types/general-specialization';
import {CseqaGeneralSpecialization} from '../types/cseqa-general-specialization';
import {CseqaSpecificSpecialization} from '../types/cseqa-specific-specialization';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';

import {Permission} from 'src/app/core/enum/permission';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-external-reviewers-candidates-details',
  templateUrl: './external-reviewers-candidates-details.component.html',
  styleUrl: './external-reviewers-candidates-details.component.scss'
})
export class ExternalReviewerCandidatesDetailsComponent {
  module: 'CHEQA' | 'CSEQA' | 'OQF' | null = null;
  requestId!: string;
  title: string = '';
  personalDataTabInputs = new Map<string, any>();
  qualificationsTabInputs = new Map<string, any>();
  experienceInformationTabInputs = new Map<string, any>();
  showUserRegistryList: boolean = false;
  externalReviewersHistory: any[] = [];
  showTabs: boolean = false;
  requestObject: any;
  mainRequestData: any;
  trainingResultObj: any;
  externalReviewInterviewResultInfo: ExternalReviewInterviewResultInfo = {} as ExternalReviewInterviewResultInfo;
  erActivities: SystemLookupDto[] = [];
  isSubmitted: boolean = false;
  canEditMetAndNotMet: boolean = false;
  taskId: string | null = null;

  countryList: CountryDto[] = [];
  cityList: CityDto[] = [];
  prefixList: SystemLookupDto[] = [];
  genderList: SystemLookupDto[] = [];
  languageList: SystemLookupDto[] = [];
  organizationList: SystemLookupDto[] = [];
  higherEducationList: SystemLookupDto[] = [];
  governorateList: GovernorateDto[] = [];
  institutionList: SystemLookupDto[] = [];
  broadFieldList: BroadField[] = [];
  generalSpecializationList: GeneralSpecialization[] = [];
  cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
  cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];

  constructor(private route: ActivatedRoute,
    private externalReviewerManagementService: ExternalReviewerManagementService,
    private registrationRequestService: ExternalReviewersRegistrationRequestService,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    private commonService: CommonService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService,
    private authService: AuthService) {
      
    }

  tabs: TabItem[] = [
    {
      labelAr: 'البيانات الشخصية',
      labelEn: 'personal informations',
      component: PersonalInfoTabComponent,
      inputs: this.personalDataTabInputs
    },
    {
      labelAr: 'بيانات المؤهلات والخبرات',
      labelEn: 'Qualifications and Experience',
      component: QualaficationsAndSkillsTabComponent,
      inputs: this.qualificationsTabInputs
    }
    ,
    {
      labelAr: 'الخبرات ذات الصلة والمرفقات',
      labelEn: 'Experience information',
      component: ExperienceInformationTabComponent,
      inputs: this.experienceInformationTabInputs
    }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.requestId = params.get('id')!;
      this.getRequestObj(this.requestId);
    })
  }


  getRequestObj(requestId: any) {
    this.registrationRequestService.getRequestByRequestIdAndTaskId(requestId, null).subscribe({
      next: (response) => {
        this.requestObject = response.data;
        this.module = this.requestObject.oaaaService.module;
        this.trainingResultObj = this.requestObject.externalReviewersRegistrationRequestInfo?.externalReviewerTrainingResult;
        this.externalReviewInterviewResultInfo = this.requestObject.externalReviewersRegistrationRequestInfo?.externalReviewInterviewResult;
        this.pageTitle();
        this.preparedMainRequestData();
        this.getExternalReviewersByModuleNotAndUserId(this.requestObject.applicantUserId, this.requestObject.oaaaService.module);
        
        this.checkCritieriaTabPermission();
        this.loadData();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  preparedMainRequestData() {
    const registrationStatus = this.requestObject.externalReviewersRegistrationRequestInfo?.registrationStatus;

    this.mainRequestData = {
      requestDate: this.requestObject.requestDate,
      applicationNo: this.requestObject.applicationNo,
      stepNameAr: this.module === 'CSEQA' && registrationStatus === 'MET' ? this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`) : this.translate.instant(`PAGES.COMMON.LABELS.${registrationStatus}`),
      stepNameEn: this.module === 'CSEQA' && registrationStatus === 'MET' ? this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`) : this.translate.instant(`PAGES.COMMON.LABELS.${registrationStatus}`),
      statusNameAr: this.requestObject.serviceStep.statusNameAr,
      statusNameEn: this.requestObject.serviceStep.statusNameEn,
      serviceNameAr: this.requestObject.oaaaService.serviceNameAr,
      serviceNameEn: this.requestObject.oaaaService.serviceNameEn,
    };
  }

  pageTitle() {
    this.title = this.translate.instant('PAGES.EXTERNAL_REVIEWERS_CANDIDATES_DETAILS.TITLES.DETAILS_' + this.requestObject.oaaaService.module);
  }

  getExternalReviewersByModuleNotAndUserId(userId: any, module: any) {
    this.registrationRequestService.getExternalReviewersByModuleNotAndUserId(userId, module).subscribe({
      next: (response) => {
        this.showUserRegistryList = true;
        this.externalReviewersHistory = response.data;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  private loadData() {
    forkJoin({
      countryList: this.commonService.getAllCountries(),
      prefixList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.TITLE),
      genderList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.GENDER),
      languageList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.LANGUAGES),
      higherEducationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.HIGHER_EDUCATION_LEVELS),
      institutionList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.INSTITUTIONS),
      erActivities: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ER_ACTIVITIES),
      organizationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ORGANIZATION),
      broadFieldList: this.externalReviewerRegistrationService.getBroadFields(),
      governorates: this.commonService.getAllGovernorates(),
      generalSpecializationList: this.externalReviewerRegistrationService.getGeneralSpecific(),
      cseqaGeneralSpecializationList: this.externalReviewerRegistrationService.getCseqaGeneralSpecializations(),
      cseqaSpecificSpecializationList: this.externalReviewerRegistrationService.getCseqaSpecificSpecializations(),
    }).subscribe({
      next: (res) => {
        this.countryList = res.countryList.data;
        this.prefixList = res.prefixList.data;
        this.genderList = res.genderList.data;
        this.languageList = res.languageList.data;
        this.higherEducationList = res.higherEducationList.data;
        this.institutionList = res.institutionList.data;
        this.erActivities = res.erActivities.data;
        this.broadFieldList = res.broadFieldList;
        this.generalSpecializationList = res.generalSpecializationList;
        this.cseqaGeneralSpecializationList = res.cseqaGeneralSpecializationList;
        this.cseqaSpecificSpecializationList = res.cseqaSpecificSpecializationList;
        this.organizationList = res.organizationList.data;
        this.governorateList = res.governorates.data;


        this.personalDataTabInputs.set('user', this.requestObject.applicantUser);
        this.personalDataTabInputs.set('countryList', this.countryList);
        this.personalDataTabInputs.set('prefixList', this.prefixList);
        this.personalDataTabInputs.set('genderList', this.genderList);
        this.personalDataTabInputs.set('organizationList', this.organizationList);
        this.personalDataTabInputs.set('governorateList', this.governorateList);
        this.personalDataTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);

        this.qualificationsTabInputs.set('languageList', this.languageList);
        this.qualificationsTabInputs.set('higherEducationList', this.higherEducationList);
        this.qualificationsTabInputs.set('institutionList', this.institutionList);
        this.qualificationsTabInputs.set('broadFieldList', this.broadFieldList);
        this.qualificationsTabInputs.set('generalSpecializationList', this.generalSpecializationList);
        this.qualificationsTabInputs.set('cseqaGeneralSpecializationList', this.cseqaGeneralSpecializationList);
        this.qualificationsTabInputs.set('cseqaSpecificSpecializationList', this.cseqaSpecificSpecializationList);

        this.qualificationsTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);

        this.experienceInformationTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);

        this.showTabs = true;

      },
      error: err =>
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false })

    });
  }

  // getExternalReviewerById() {
  //   this.externalReviewerManagementService.getExternalReviewerById(Number(this.externalReviewerId)).subscribe({
  //     next: (response) => {
  //       this.externalReviewer = response.data;
  //       this.trainingResultObj = this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.externalReviewerTrainingResult;
  //       this.getRequestObj(this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.requestId);
  //     },
  //     error: (error) => {
  //       this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
  //     }
  //   });
  // }

    checkCritieriaTabPermission() {
      const userClaim = this.authService.getUserClaim(); // or from observable
      const userPermissions = userClaim?.permissions ?? [];
      const hasAccess = userPermissions.includes(this.returnCurrentModulePermission());
    
    }
  
    private returnCurrentModulePermission(): any {
      switch (this.requestObject.externalReviewersRegistrationRequestInfo.module) {
        case 'CHEQA':
          return Permission.CHEQA_ER_Registration_Request_VIEW_ALL;
        case 'CSEQA':
          return Permission.CSEQA_ER_Registration_Request_VIEW_ALL;
        case 'OQF':
          return Permission.OQF_ER_Registration_Request_VIEW_ALL;
      }
    }
  protected readonly Permission = Permission;
}
