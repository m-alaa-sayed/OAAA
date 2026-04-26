import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {
    ExternalReviewersRegistrationRequestService
} from 'src/app/core/services/external-reviewers-registration-request.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewerAttachments} from '../../types/external-reviewer-attachments';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {PersonalInfoTabComponent} from './tabs/personal-info-tab/personal-info-tab.component';
import {
    QualaficationsAndSkillsTabComponent
} from './tabs/qualafications-and-skills-tab/qualafications-and-skills-tab.component';
import {forkJoin} from 'rxjs';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {CityDto} from 'src/app/core/models/city-dto';
import {CountryDto} from 'src/app/core/models/country-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {BroadField} from '../../types/broad-field';
import {CommonService} from 'src/app/core/services/common.service';
import {ExternalReviewerSettingsService} from 'src/app/core/services/external-reviewer-settings.service';
import {ExternalReviewerRegistrationService} from '../../services/external-reviewer-registration.service';
import {ExternalReviewerSettingDto} from '../../types/external-reviewer-setting.dto';
import {PledgeTabComponent} from './tabs/pledge-tab/pledge-tab.component';
import {
    ExperienceInformationTabComponent
} from './tabs/experience-information-tab/experience-information-tab.component';
import {InitialCriteriaTabComponent} from './tabs/initial-criteria-tab/initial-criteria-tab.component';
import {Criterion} from '../../types/acceptance-criteria/criterion';
import {ExternalReviewerRequestService} from '../../services/external-reviewer-request.service';
import {ExternalReviewersRegistrationComplete} from '../../types/external-reviewers-registration-complete';
import {UserClaim} from 'src/app/core/models/user-claim';
import {Permission} from 'src/app/core/enum/permission';
import {AuthService} from 'src/app/core/services/auth.service';
import {GeneralSpecialization} from '../../types/general-specialization';
import {CseqaGeneralSpecialization} from '../../types/cseqa-general-specialization';
import {CseqaSpecificSpecialization} from '../../types/cseqa-specific-specialization';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';

@Component({
  selector: 'app-external-reviewer-registration-request-details',
  templateUrl: './external-reviewer-registration-request-details.component.html',
  styleUrl: './external-reviewer-registration-request-details.component.scss'
})
export class ExternalReviewerRegistrationRequestDetailsComponent implements OnInit {
  id: string | null = '';
  taskId: any = null;
  requestObject: any;
  mainRequestData: any;
  showTabs: boolean = false;
  title: string = '';
  isSubmitted: boolean = false;
  erActivities: SystemLookupDto[] = [];

  acceptancePercentage: number = 0;
  acceptancePercentageMsg = {
    msg: '',
    exceeded: false
  }
  module: 'CHEQA' | 'CSEQA' | 'OQF' | null = null;
  
  pledgTabInputs = new Map<string, any>();
  personalDataTabInputs = new Map<string, any>();
  qualificationsTabInputs = new Map<string, any>();
  experienceInformationTabInputs = new Map<string, any>();
  initialCriteriaTabInputs = new Map<string, any>();

  externalReviewerSettingDto: ExternalReviewerSettingDto = new ExternalReviewerSettingDto();
  countryList: CountryDto[] = [];
  cityList: CityDto[] = [];
  prefixList: SystemLookupDto[] = [];
  genderList: SystemLookupDto[] = [];
  languageList: SystemLookupDto[] = [];
  higherEducationList: SystemLookupDto[] = [];
  institutionList: SystemLookupDto[] = [];
  broadFieldList: BroadField[] = [];
  generalSpecializationList: GeneralSpecialization[] = [];
  cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
  cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];
  governorateList: GovernorateDto[] = [];
  expertiseYearList: SystemLookupDto[] = [];
  organizationList: SystemLookupDto[] = [];
  canEditMetAndNotMet: boolean = false;


  criterionList: Criterion[] = [];

  externalReviewersHistory: any[] = [];
  showWizard: boolean = false;
  showUserRegistryList: boolean = false;

  isReturnForEdit: boolean = false;
  userClaim: UserClaim | null = null;

  constructor(private route: ActivatedRoute,
    private registrationRequestService: ExternalReviewersRegistrationRequestService,
    private toastService: ToastService,
    public translate: TranslateService,
    private settingsService: ExternalReviewerSettingsService,
    private commonService: CommonService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService,
    private externalReviewerRequestService: ExternalReviewerRequestService,
    private router: Router,
    private authService: AuthService
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
    ,
    {
      labelAr: 'إقرار',
      labelEn: 'Declaration',
      component: PledgeTabComponent,
      inputs: this.pledgTabInputs
    }
  ];
  isRejoinRequest = false;


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.taskId = this.route.snapshot.paramMap.get('taskId') || null;
    this.registrationRequestService.getRequestByRequestIdAndTaskId(this.id, this.taskId).subscribe({
      next: (response) => {
        this.requestObject = response.data;
        this.module = this.requestObject.oaaaService.module;
        this.isRejoinRequest = AppConstants.REJOIN_SERVICES.includes(this.requestObject.oaaaService.serviceCode);
        this.pageTitle();
        this.getExternalReviewersByModuleNotAndUserId(this.requestObject.applicantUserId, this.requestObject.oaaaService.module);
        this.preparedMainRequestData();
        this.checkCritieriaTabPermission();
        this.isReturnForEdit = this.requestObject.serviceStep.stepCode.includes('_RETURN_FOR_EDIT');
        if(this.isReturnForEdit && this.requestObject.externalReviewersRegistrationRequestInfo.qualification.cseqaGeneralSpecializationId == 19){
              this.requestObject.externalReviewersRegistrationRequestInfo.qualification.cseqaGeneralSpecializationId = undefined;
              this.requestObject.externalReviewersRegistrationRequestInfo.qualification.otherCseqaGeneralSpecialization = "";
        }
        this.loadData();

        this.qualificationsTabInputs.set('isEditMode', this.isReturnForEdit && this.taskId);
        this.personalDataTabInputs.set('noObjectionCertificateEnable', this.isReturnForEdit && this.taskId);
        this.personalDataTabInputs.set('noObjectionCertificateVisible', false);
      
        this.experienceInformationTabInputs.set('isEditMode', this.isReturnForEdit && this.taskId);
        this.initialCriteriaTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);
        this.acceptancePercentage = this.requestObject.externalReviewersRegistrationRequestInfo.successPercent || 0;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  checkCritieriaTabPermission() {
    const userClaim = this.authService.getUserClaim(); // or from observable
    const userPermissions = userClaim?.permissions ?? [];
    const hasAccess = userPermissions.includes(this.returnCurrentModulePermission());
    if (hasAccess) {
      this.tabs.push({
        labelAr: 'المعايير الأولية',
        labelEn: 'Initial Criteria',
        component: InitialCriteriaTabComponent,
        inputs: this.initialCriteriaTabInputs
      });
    }
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

  pageTitle() {
    if (this.isRejoinRequest) {
      this.translate.get('PAGES.REQUEST_DETAILS.LABELS.' + this.requestObject.oaaaService.module + '_REJOIN_TITLE')
        .subscribe({
          next: value => this.title = value
        });
    } else {
      this.translate.get('PAGES.REQUEST_DETAILS.LABELS.' + this.requestObject.oaaaService.module + '_TITLE')
        .subscribe({
          next: value => this.title = value
        });
    }
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

  preparedMainRequestData() {
    const registrationStatus = this.requestObject.externalReviewersRegistrationRequestInfo?.registrationStatus;
    
    this.mainRequestData = {
      requestDate: this.requestObject.requestDate,
      applicationNo: this.requestObject.applicationNo,
     stepNameAr: this.module === 'CSEQA' && registrationStatus === 'MET' ? this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`) : this.translate.instant(`PAGES.COMMON.LABELS.${registrationStatus}`),
      stepNameEn: this.module === 'CSEQA' && registrationStatus === 'MET' ? this.translate.instant(`PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA`) : this.translate.instant(`PAGES.COMMON.LABELS.${registrationStatus}`),
      statusNameAr: this.requestObject.serviceStep.statusNameAr,
      statusNameEn: this.requestObject.serviceStep.statusNameEn,
    };
  }

  updateAttchment(updatedAttachmentList: ExternalReviewerAttachments[]) {
    this.requestObject.attachmentList = updatedAttachmentList;
  }




  private loadData() {
    forkJoin({
      externalReviewerSettingDto: this.settingsService.getSettingsByModule(this.requestObject.externalReviewersRegistrationRequestInfo.module || ''),
      countryList: this.commonService.getAllCountries(),
      prefixList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.TITLE),
      genderList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.GENDER),
      languageList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.LANGUAGES),
      higherEducationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.HIGHER_EDUCATION_LEVELS),
      institutionList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.INSTITUTIONS),
      broadFieldList: this.externalReviewerRegistrationService.getBroadFields(),
      generalSpecializationList: this.externalReviewerRegistrationService.getGeneralSpecific(),
      cseqaGeneralSpecializationList: this.isReturnForEdit
        ? this.externalReviewerRegistrationService.getCseqaGeneralSpecializations(true)
        : this.externalReviewerRegistrationService.getCseqaGeneralSpecializations(),
      cseqaSpecificSpecializationList: this.externalReviewerRegistrationService.getCseqaSpecificSpecializations(),
      erActivities: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ER_ACTIVITIES),
      criterionList: this.externalReviewerRegistrationService.getAllCriteriaWithCurrentVersionsByRequestInfoId(this.requestObject.externalReviewersRegistrationRequestInfo.module, this.requestObject.externalReviewersRegistrationRequestInfo.id),
      governorates: this.commonService.getAllGovernorates(),
      expertiseYearList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.EXPERIENCE),
      organizationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ORGANIZATION),


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
        this.governorateList = res.governorates.data;
        this.expertiseYearList = res.expertiseYearList.data;
        this.organizationList = res.organizationList.data;
        this.erActivities = res.erActivities.data;
        this.criterionList = this.filterActiveCriteria(res.criterionList.data);        

        this.externalReviewerSettingDto = res.externalReviewerSettingDto;

        this.personalDataTabInputs.set('user', this.requestObject.applicantUser);
        this.personalDataTabInputs.set('countryList', this.countryList);
        this.personalDataTabInputs.set('prefixList', this.prefixList);
        this.personalDataTabInputs.set('genderList', this.genderList);
        this.personalDataTabInputs.set('governorateList', this.governorateList);
        this.personalDataTabInputs.set('organizationList', this.organizationList);

        this.qualificationsTabInputs.set('languageList', this.languageList);
        this.qualificationsTabInputs.set('higherEducationList', this.higherEducationList);
        this.qualificationsTabInputs.set('institutionList', this.institutionList);
        this.qualificationsTabInputs.set('broadFieldList', this.broadFieldList);
        this.qualificationsTabInputs.set('generalSpecializationList', this.generalSpecializationList);
        this.qualificationsTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);
        this.qualificationsTabInputs.set('cseqaGeneralSpecializationList', this.cseqaGeneralSpecializationList);
        this.qualificationsTabInputs.set('cseqaSpecificSpecializationList', this.cseqaSpecificSpecializationList);

        this.pledgTabInputs.set('externalReviewerSettingDto', this.externalReviewerSettingDto);
        this.pledgTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);
        this.experienceInformationTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);
        this.personalDataTabInputs.set('externalReviewersRegistrationRequestInfo', this.requestObject.externalReviewersRegistrationRequestInfo);
        this.qualificationsTabInputs.set('expertiseYearList', this.expertiseYearList);


        this.initialCriteriaTabInputs.set('criterionList', this.criterionList);
        this.initialCriteriaTabInputs.set('isEditMode', this.taskId);
        this.initialCriteriaTabInputs.set('onCriteriaValueChanged', (totalScore: number) => this.changeRecommendation(totalScore));


        this.showTabs = true;
    
        // Determine if Met/Not Met can be edited
        if(this.criterionList.length == 0 && this.taskId !== null){
          this.canEditMetAndNotMet = true;
        } else if(this.taskId == null || this.module === 'CHEQA') {
            this.canEditMetAndNotMet = false;
        } else {
            this.canEditMetAndNotMet = true;
        }

      },
      error: err =>
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false })

    });
  }


  addAttchment(attachmentObject: ExternalReviewerAttachments) {
    if (!this.requestObject.requestAttachmentList) {
      this.requestObject.requestAttachmentList = []
    }
    this.requestObject.requestAttachmentList.push(attachmentObject);
  }



  removeAttchment(index: number) {
    this.requestObject.requestAttachmentList?.splice(index, 1);
  }

  isActivitySelected(activity: any): boolean {
    return this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList
      ?.some((item: any) => item.activityId === activity.activityId);
  }

  toggleActivity(activity: any, checked: boolean): void {
    if (!this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList) {
      this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList = [];
    }
    const list = this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList;

    if (checked) {
      if (!list.some((item: any) => item.activityId === activity.id)) {
        const activityObj: any = {
          activityId: activity.id
        }
        list.push(activityObj);
      }
    } else {
      const index = list.findIndex((item: any) => item.activityId === activity.activityId);
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }


  submit(event: any) {
    const sendObject: ExternalReviewersRegistrationComplete = {
      requestDto: this.requestObject,
      action: event.action,
      comment: event.comment,
      taskId: this.taskId
    };
    this.externalReviewerRequestService.complete(sendObject).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: this.requestObject.applicationNo, action: event.action }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  filterActiveCriteria(criteria: Criterion[]): Criterion[] {
    return criteria
      ?.map(criterion => {
        const version = criterion.currentVersion;

        if (version.status !== AppConstants.LOOKUP_CODE.ACTIVE) return null;

        const filteredSubCriteria = version.subCriteriaList
          ?.filter(sub => sub.status === AppConstants.LOOKUP_CODE.ACTIVE)
          ?.map(sub => {
            const filteredItems = sub.items
              ?.filter(item => item.status === AppConstants.LOOKUP_CODE.ACTIVE)
              ?.map(item => {
                // Add to total score if item is required
                if (item.required) {
                  if (!version.totalRequiredScore) {
                    version.totalRequiredScore = 0;
                  }
                  version.totalRequiredScore +=
                    item.maxScore ?
                      Number(item.maxScore) : this.getMaxScore(item);
                }
                return { ...item };
              });
            return {
              ...sub,
              items: filteredItems
            };
          });

        if (filteredSubCriteria.length === 0) return null;

        return {
          ...criterion,
          currentVersion: {
            ...version,
            subCriteriaList: filteredSubCriteria
          }
        };
      })
      .filter((c): c is Criterion => c !== null);
  }


  getMaxScore(item: any): number {
    return item.options?.length
      ? Math.max(...item.options.map((opt: any) => opt.score))
      : 0;
  }


  isChecked(activityId: any): boolean {
    return this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList.some((item: { activityId: number; }) => item.activityId === activityId);
  }


  onTextChange(): void {
    const result = limitWords(this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendationNotes || '', 250);
    this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendationNotes = result.trimmedText;
  }

  changeRecommendation(totalScore: number): void {
    
    // Calculate total possible score from all criteria (same logic as initial-criteria component)
    const totalPossibleScore = this.criterionList.reduce((sum, item) => {
      return sum + (item.currentVersion?.totalRequiredScore || 0);
    }, 0);
    
    // Calculate the actual percentage from total score
    const calculatedPercentage = totalPossibleScore > 0 ? 
      Math.round((totalScore / totalPossibleScore) * 100) : 0;
    

    // Compare calculated percentage with acceptance threshold
    if (calculatedPercentage >= this.acceptancePercentage) {
      const oldRecommendation = this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendation;
      if (oldRecommendation !== 'MET') {
        this.acceptancePercentageMsg = {
          msg: `${this.translate.instant('PAGES.COMMON.MESSAGES.RESULT_EXCEEDED_ACCEPTANCE_PERCENTAGE')} ( ${this.translate.instant('PAGES.COMMON.MESSAGES.ABOVE')} ${this.acceptancePercentage}% )`,
          exceeded: true,
        };
      }
      this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendation = 'MET';
    } else {
      const oldRecommendation = this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendation;
      if (oldRecommendation !== 'NOT_MET') {
        this.acceptancePercentageMsg = {
          msg: `${this.translate.instant('PAGES.COMMON.MESSAGES.RESULT_IS_BELOW_ACCEPTANCE_PERCENTAGE')} (${this.translate.instant('PAGES.COMMON.MESSAGES.BELOW')} ${this.acceptancePercentage}% )`,
          exceeded: false
        };
      }
      this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendation = 'NOT_MET';
    }

  }

  protected readonly Permission = Permission;
}
