import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExternalReviewerManagementService} from '../../services/external-reviewer-management.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {TranslateService} from '@ngx-translate/core';
import {
    PersonalInfoTabComponent
} from '../../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/personal-info-tab/personal-info-tab.component';
import {
    QualaficationsAndSkillsTabComponent
} from '../../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/qualafications-and-skills-tab/qualafications-and-skills-tab.component';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {
    ExperienceInformationTabComponent
} from '../../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/experience-information-tab/experience-information-tab.component';
import {
    ExternalReviewersRegistrationRequestService
} from 'src/app/core/services/external-reviewers-registration-request.service';
import {ExternalReviewer} from '../../types/external-reviewer';
import {forkJoin} from 'rxjs';
import {CountryDto} from 'src/app/core/models/country-dto';
import {CityDto} from 'src/app/core/models/city-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {BroadField} from '../../types/broad-field';
import {CommonService} from 'src/app/core/services/common.service';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {ExternalReviewerRegistrationService} from '../../services/external-reviewer-registration.service';
import {GeneralSpecialization} from '../../types/general-specialization';
import {CseqaGeneralSpecialization} from '../../types/cseqa-general-specialization';
import {CseqaSpecificSpecialization} from '../../types/cseqa-specific-specialization';
import {
    ExternalReviewInterviewResultInfo
} from '../../types/external-reviewers-interview-result/external-review-interview-result-info';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';

@Component({
  selector: 'app-external-reviewer-details',
  templateUrl: './external-reviewer-details.component.html',
  styleUrl: './external-reviewer-details.component.scss'
})
export class ExternalReviewerDetailsComponent {
  module: 'CHEQA' | 'CSEQA' | 'OQF' | null = null;
  externalReviewerId!: string;
  title: string = '';
  erManagementTitle: string = '';
  erManagementURL: string = '';
  personalDataTabInputs = new Map<string, any>();
  qualificationsTabInputs = new Map<string, any>();
  experienceInformationTabInputs = new Map<string, any>();
  showUserRegistryList: boolean = false;
  externalReviewersHistory: any[] = [];
  showTabs: boolean = false;
  requestObject: any;
  externalReviewer: ExternalReviewer = {} as ExternalReviewer;
  mainRequestData: any;
  trainingResultObj: any;
  countryList: CountryDto[] = [];
  cityList: CityDto[] = [];
  prefixList: SystemLookupDto[] = [];
  genderList: SystemLookupDto[] = [];
  languageList: SystemLookupDto[] = [];
  organizationList: SystemLookupDto[] = [];
  higherEducationList: SystemLookupDto[] = [];
  institutionList: SystemLookupDto[] = [];
  broadFieldList: BroadField[] = [];
  governorateList: GovernorateDto[] = [];
  generalSpecializationList: GeneralSpecialization[] = [];
  cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
  cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];
  externalReviewInterviewResultInfo: ExternalReviewInterviewResultInfo = {} as ExternalReviewInterviewResultInfo;

  erActivities: SystemLookupDto[] = [];

  constructor(private route: ActivatedRoute,
    private externalReviewerManagementService: ExternalReviewerManagementService,
    private registrationRequestService: ExternalReviewersRegistrationRequestService,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    private commonService: CommonService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService
  ) {
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
      this.externalReviewerId = params.get('id')!;
      this.getExternalReviewerById();
    })
  }

  getExternalReviewerById() {
    this.externalReviewerManagementService.getExternalReviewerById(Number(this.externalReviewerId)).subscribe({
      next: (response) => {
        this.externalReviewer = response.data;
        this.module = this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.module;
        this.trainingResultObj = this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.externalReviewerTrainingResult;
        this.externalReviewInterviewResultInfo = this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.externalReviewInterviewResult || {};
        this.getRequestObj(this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.requestId);
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  getRequestObj(requestId: any) {
    this.registrationRequestService.getRequestByRequestIdAndTaskId(requestId, null).subscribe({
      next: (response) => {
        this.requestObject = response.data;
        this.pageTitle();
        this.preparedMainRequestData();
        this.getExternalReviewersByModuleNotAndUserId(this.requestObject.applicantUserId, this.requestObject.oaaaService.module);
        this.loadData();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  preparedMainRequestData() {
    this.mainRequestData = {
      requestDate: this.requestObject.requestDate,
      applicationNo: this.requestObject.applicationNo,
      stepNameAr: this.requestObject.serviceStep.stepNameAr,
      stepNameEn: this.requestObject.serviceStep.stepNameEn,
      statusNameAr: this.requestObject.serviceStep.statusNameAr,
      statusNameEn: this.requestObject.serviceStep.statusNameEn,
      serviceNameAr: this.requestObject.oaaaService.serviceNameAr,
      serviceNameEn: this.requestObject.oaaaService.serviceNameEn,
    };
  }

  pageTitle() {
    this.title = this.translate.instant('PAGES.EXTERNAL_REVIEWER.TITLES.DETAILS_' + this.externalReviewer.module);
    this.erManagementTitle = this.translate.instant('PAGES.EXTERNAL_REVIEWER.TITLES.' + this.externalReviewer.module);
    this.erManagementURL = 'jawda/external-reviewers/external-reviewers-management/' + this.externalReviewer.module;
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
        this.personalDataTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);
        this.personalDataTabInputs.set('governorateList', this.governorateList);
        this.personalDataTabInputs.set('organizationList', this.organizationList);
        this.personalDataTabInputs.set('noObjectionCertificateEnable', false);

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
}
