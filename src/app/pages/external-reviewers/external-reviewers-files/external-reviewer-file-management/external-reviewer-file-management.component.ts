import {Component, Input} from '@angular/core';
import {TabItem} from 'src/app/shared/tabs-template/tab-item';
import {
    ExperienceInformationTabComponent
} from '../../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/experience-information-tab/experience-information-tab.component';
import {
    PersonalInfoTabComponent
} from '../../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/personal-info-tab/personal-info-tab.component';
import {
    QualaficationsAndSkillsTabComponent
} from '../../external-reviewer-registration-service/external-reviewer-registration-request-details/tabs/qualafications-and-skills-tab/qualafications-and-skills-tab.component';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewerManagementService} from '../../services/external-reviewer-management.service';
import {ExternalReviewer} from '../../types/external-reviewer';
import {CityDto} from 'src/app/core/models/city-dto';
import {CountryDto} from 'src/app/core/models/country-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {BroadField} from '../../types/broad-field';
import {ExternalReviewerSettingDto} from '../../types/external-reviewer-setting.dto';
import {CommonService} from 'src/app/core/services/common.service';
import {forkJoin} from 'rxjs';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {ExternalReviewerSettingsService} from 'src/app/core/services/external-reviewer-settings.service';
import {ExternalReviewerRegistrationService} from '../../services/external-reviewer-registration.service';
import {AvailabilitySettingsTabComponent} from '../tabs/availability-settings-tab/availability-settings-tab.component';
import {BaseModal} from 'src/app/shared/base-modal';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {Audit} from 'src/app/core/models/audit';
import {ExternalReviewerEventsService} from '../../services/external-reviewer-events.service';
import {GeneralSpecialization} from '../../types/general-specialization';
import {CseqaGeneralSpecialization} from '../../types/cseqa-general-specialization';
import {CseqaSpecificSpecialization} from '../../types/cseqa-specific-specialization';

@Component({
  selector: 'app-external-reviewer-file-management',
  templateUrl: './external-reviewer-file-management.component.html',
  styleUrl: './external-reviewer-file-management.component.scss'
})
export class ExternalReviewerFileManagementComponent extends BaseModal {

  @Input() id: any;

  externalReviewer: ExternalReviewer = {} as ExternalReviewer;

  //-- inputs 
  personalDataTabInputs = new Map<string, any>();
  qualificationsTabInputs = new Map<string, any>();
  experienceInformationTabInputs = new Map<string, any>();
  availabilitySettingsTabTabInputs = new Map<string, any>();

  //-- lists
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
  currentTab = 1;

  auditTotal: number = 0;
  auditLogs: Audit[] = [];

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
    },
    {
      labelAr: 'إعدادات التوافر',
      labelEn: 'Availability Settings',
      component: AvailabilitySettingsTabComponent,
      inputs: this.availabilitySettingsTabTabInputs
    }
  ];

  constructor(
    public override modalService: NgbModal,
    private toastService: ToastService,
    public translate: TranslateService,
    private commonService: CommonService,
    private externalReviewerManagementService: ExternalReviewerManagementService,
    private settingsService: ExternalReviewerSettingsService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService,
    private externalReviewerEventsService: ExternalReviewerEventsService,
    private router: Router
  ) {
    super(modalService);
  }

  ngOnInit(): void {
    this.getExternalReviewerFiles(false);
  }

  getExternalReviewerFiles(isDataLoaded: boolean) {
    this.externalReviewerManagementService.getExternalReviewerByIdAndLoggedUserId(this.id).subscribe({
      next: (response) => {
        this.externalReviewer = response.data;
        this.externalReviewer.currentIsAvailable = this.externalReviewer.isAvailable;
        if (!isDataLoaded)
          this.loadData();
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  private loadData() {
    forkJoin({
      externalReviewerSettingDto: this.settingsService.getSettingsByModule(this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.module || ''),
      countryList: this.commonService.getAllCountries(),
      prefixList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.TITLE),
      genderList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.GENDER),
      languageList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.LANGUAGES),
      higherEducationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.HIGHER_EDUCATION_LEVELS),
      institutionList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.INSTITUTIONS),
      broadFieldList: this.externalReviewerRegistrationService.getBroadFields(),
      generalSpecializationList: this.externalReviewerRegistrationService.getGeneralSpecific(),
      cseqaGeneralSpecializationList: this.externalReviewerRegistrationService.getCseqaGeneralSpecializations(),
      cseqaSpecificSpecializationList: this.externalReviewerRegistrationService.getCseqaSpecificSpecializations(),
      erActivities: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ER_ACTIVITIES),
      criterionList: this.externalReviewerRegistrationService.getAllCriteriaWithCurrentVersionsByRequestInfoId(this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.module || '',this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.id),
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


        this.externalReviewerSettingDto = res.externalReviewerSettingDto;

        if (this.externalReviewer.externalReviewersActiveRegistrationRequestInfo)
          this.externalReviewer.externalReviewersActiveRegistrationRequestInfo.insideOman = this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.user?.insideOman;

        this.personalDataTabInputs.set('user', this.externalReviewer.externalReviewersActiveRegistrationRequestInfo?.user);
        this.personalDataTabInputs.set('countryList', this.countryList);
        this.personalDataTabInputs.set('prefixList', this.prefixList);
        this.personalDataTabInputs.set('genderList', this.genderList);

        this.qualificationsTabInputs.set('languageList', this.languageList);
        this.qualificationsTabInputs.set('higherEducationList', this.higherEducationList);
        this.qualificationsTabInputs.set('institutionList', this.institutionList);
        this.qualificationsTabInputs.set('broadFieldList', this.broadFieldList);
        this.qualificationsTabInputs.set('generalSpecializationList', this.generalSpecializationList);
        this.qualificationsTabInputs.set('cseqaGeneralSpecializationList', this.cseqaGeneralSpecializationList);
        this.qualificationsTabInputs.set('cseqaSpecificSpecializationList', this.cseqaSpecificSpecializationList);

        this.qualificationsTabInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewer.externalReviewersActiveRegistrationRequestInfo);

        this.experienceInformationTabInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewer.externalReviewersActiveRegistrationRequestInfo);
        this.personalDataTabInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewer.externalReviewersActiveRegistrationRequestInfo);
        this.availabilitySettingsTabTabInputs.set('externalReviewer', this.externalReviewer);

        this.qualificationsTabInputs.set('isEditMode', ['ACTIVE', 'INACTIVE', 'WITHDRAW'].includes(this.externalReviewer.status || ''));
        this.experienceInformationTabInputs.set('isEditMode', ['ACTIVE', 'INACTIVE', 'WITHDRAW'].includes(this.externalReviewer.status || ''));

        this.availabilitySettingsTabTabInputs.set('isEditMode', ['ACTIVE', 'INACTIVE', 'WITHDRAW'].includes(this.externalReviewer.status || ''));

      },
      error: err =>
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false })

    });
  }




  validateForm(content: any) {
    // this.isSubmitting = true;
    // if (this.submitForm?.invalid) {
    //   scrollTo(0, 0);
    //   return;
    // }

    this.open(content);
  }


  updateExternalReviewer() {
    this.close();
    this.externalReviewerManagementService.updateExternalReviewer(this.externalReviewer).subscribe({
      next: (response) => {
        this.externalReviewerEventsService.emitReviewerUpdated();
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.EDIT_SUCCESS'), { classname: 'bg-success text-white', delay: 3000 });
        this.getExternalReviewerFiles(true);
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


}
