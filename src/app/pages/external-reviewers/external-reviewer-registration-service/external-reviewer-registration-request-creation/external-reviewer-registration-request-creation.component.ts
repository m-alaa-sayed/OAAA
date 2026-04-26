import {Component, OnInit} from '@angular/core';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {forkJoin} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ExternalReviewerSettingsService} from 'src/app/core/services/external-reviewer-settings.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {CommonService} from 'src/app/core/services/common.service';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {CityDto} from 'src/app/core/models/city-dto';
import {CountryDto} from 'src/app/core/models/country-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {ExternalReviewerSettingDto} from "../../types/external-reviewer-setting.dto";
import {PersonalInfoStepComponent} from "./steps/personal-info-step/personal-info-step.component";
import {
    QualaficationsAndSkillsStepComponent
} from "./steps/qualafications-and-skills-step/qualafications-and-skills-step.component";
import {
    ExperienceInformationStepComponent
} from "./steps/experience-information-step/experience-information-step.component";
import {PledgeStepComponent} from "./steps/pledge-step/pledge-step.component";
import {ExternalReviewerRegistrationService} from '../../services/external-reviewer-registration.service';
import {BroadField} from '../../types/broad-field';
import {ExternalReviewersRegistrationRequestInfo} from '../../types/external-reviewers-registration-request-info';
import {ActivatedRoute} from '@angular/router';
import {ExternalReviewerManagementService} from "../../services/external-reviewer-management.service";
import {GeneralSpecialization} from '../../types/general-specialization';
import {CseqaGeneralSpecialization} from '../../types/cseqa-general-specialization';
import {CseqaSpecificSpecialization} from '../../types/cseqa-specific-specialization';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';

@Component({
    selector: 'app-external-reviewer-registration',
    templateUrl: './external-reviewer-registration-request-creation.component.html',
    styleUrl: './external-reviewer-registration-request-creation.component.scss'
})
export class ExternalReviewerRegistrationRequestCreationComponent implements OnInit {

    externalReviewersRegistrationRequestInfo: ExternalReviewersRegistrationRequestInfo = {} as ExternalReviewersRegistrationRequestInfo;

    externalReviewerSettingDto: ExternalReviewerSettingDto = new ExternalReviewerSettingDto();

    pledgStepsInputs = new Map<string, any>();
    personalDataStepsInputs = new Map<string, any>();
    qualificationsStepsInputs = new Map<string, any>();
    experienceInformationStepsInputs = new Map<string, any>();

    countryList: CountryDto[] = [];
    cityList: CityDto[] = [];
    prefixList: SystemLookupDto[] = [];
    genderList: SystemLookupDto[] = [];
    languageList: SystemLookupDto[] = [];
    higherEducationList: SystemLookupDto[] = [];
    institutionList: SystemLookupDto[] = [];
    organizationList: SystemLookupDto[] = [];
    broadFieldList: BroadField[] = [];
    generalSpecializationList: GeneralSpecialization[] = [];
    governorateList: GovernorateDto[] = [];

    cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
    cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];

    expertiseYearList: SystemLookupDto[] = [];

    showWizard: boolean = false;
    title: string = '';
    isRejoinRequest = false;


    constructor(
        private settingsService: ExternalReviewerSettingsService,
        private toastService: ToastService,
        public translate: TranslateService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private externalReviewerRegistrationService: ExternalReviewerRegistrationService,
        private externalReviewerManagementService: ExternalReviewerManagementService
    ) {
    }


    ngOnInit(): void {
        const module = this.route.snapshot.paramMap.get('module') || '';
        const serviceCode = history.state.serviceCode;
        this.externalReviewersRegistrationRequestInfo.module = module;
        this.externalReviewersRegistrationRequestInfo.serviceCode = serviceCode;
        this.isRejoinRequest = AppConstants.REJOIN_SERVICES.includes(serviceCode);

        this.pageTitle();
        this.loadData();

        if (this.isRejoinRequest) {
            this.getExternalReviewer();
        }
    }

    pageTitle() {
        if (this.isRejoinRequest) {
            this.translate.get('PAGES.REQUEST_DETAILS.LABELS.' + this.externalReviewersRegistrationRequestInfo.module + '_REJOIN_TITLE')
                .subscribe({
                    next: value => this.title = value
                });
        } else {
            this.translate.get('PAGES.REQUEST_DETAILS.LABELS.' + this.externalReviewersRegistrationRequestInfo.module + '_TITLE')
                .subscribe({
                    next: value => this.title = value
                });
        }
    }


    steps: StepItem[] = [
        {
            labelAr: 'البيانات الشخصية',
            labelEn: 'personal information',
            component: PersonalInfoStepComponent,
            inputs: this.personalDataStepsInputs
        },
        {
            labelAr: 'بيانات المؤهلات والخبرات',
            labelEn: 'Qualifications and Experience',
            component: QualaficationsAndSkillsStepComponent,
            inputs: this.qualificationsStepsInputs
        },
        {
            labelAr: 'الخبرات ذات الصلة والمرفقات',
            labelEn: 'Experience information',
            component: ExperienceInformationStepComponent,
            inputs: this.experienceInformationStepsInputs
        },
        {
            labelAr: 'إقرار',
            labelEn: 'Declaration',
            component: PledgeStepComponent,
            inputs: this.pledgStepsInputs
        }
    ];


    private loadData() {
        forkJoin({
            externalReviewerSettingDto: this.settingsService.getSettingsByModule(this.externalReviewersRegistrationRequestInfo.module || ''),
            countryList: this.commonService.getAllCountries(),
            prefixList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.TITLE),
            genderList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.GENDER),
            languageList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.LANGUAGES),
            higherEducationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.HIGHER_EDUCATION_LEVELS),
            institutionList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.INSTITUTIONS),
            organizationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ORGANIZATION),
            broadFieldList: this.externalReviewerRegistrationService.getBroadFields(),
            generalSpecializationList: this.externalReviewerRegistrationService.getGeneralSpecific(),
            cseqaGeneralSpecializationList: this.externalReviewerRegistrationService.getCseqaGeneralSpecializations(true),
            cseqaSpecificSpecializationList: this.externalReviewerRegistrationService.getCseqaSpecificSpecializations(),
            expertiseYearList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.EXPERIENCE),
            governorates: this.commonService.getAllGovernorates(),
        }).subscribe({
            next: (res) => {
                this.countryList = res.countryList.data;
                this.prefixList = res.prefixList.data;
                this.genderList = res.genderList.data;
                this.languageList = res.languageList.data;
                this.higherEducationList = res.higherEducationList.data;
                this.institutionList = res.institutionList.data;
                this.organizationList = res.organizationList.data;
                this.broadFieldList = res.broadFieldList;
                this.generalSpecializationList = res.generalSpecializationList;
                this.cseqaGeneralSpecializationList = res.cseqaGeneralSpecializationList;
                this.cseqaSpecificSpecializationList = res.cseqaSpecificSpecializationList;
                this.governorateList = res.governorates.data;

                this.externalReviewerSettingDto = res.externalReviewerSettingDto;

                this.expertiseYearList = res.expertiseYearList.data;


                this.personalDataStepsInputs.set('countryList', this.countryList);
                this.personalDataStepsInputs.set('prefixList', this.prefixList);
                this.personalDataStepsInputs.set('genderList', this.genderList);
                this.personalDataStepsInputs.set('governorateList', this.governorateList);
                this.personalDataStepsInputs.set('organizationList', this.organizationList);

                this.qualificationsStepsInputs.set('languageList', this.languageList);
                this.qualificationsStepsInputs.set('higherEducationList', this.higherEducationList);
                this.qualificationsStepsInputs.set('institutionList', this.institutionList);
                this.qualificationsStepsInputs.set('broadFieldList', this.broadFieldList);
                this.qualificationsStepsInputs.set('generalSpecializationList', this.generalSpecializationList);
                this.qualificationsStepsInputs.set('cseqaGeneralSpecializationList', this.cseqaGeneralSpecializationList);
                this.qualificationsStepsInputs.set('cseqaSpecificSpecializationList', this.cseqaSpecificSpecializationList);
                this.qualificationsStepsInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewersRegistrationRequestInfo);
                this.qualificationsStepsInputs.set('expertiseYearList', this.expertiseYearList);

                this.pledgStepsInputs.set('externalReviewerSettingDto', this.externalReviewerSettingDto);
                this.pledgStepsInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewersRegistrationRequestInfo);
                this.experienceInformationStepsInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewersRegistrationRequestInfo);
                this.personalDataStepsInputs.set('externalReviewersRegistrationRequestInfo', this.externalReviewersRegistrationRequestInfo);


                this.showWizard = true;

            },
            error: err =>
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), {classname: 'bg-danger text-white', autohide: false})

        });
    }

    private getExternalReviewer() {
        this.externalReviewerManagementService.getExternalReviewerByModuleAndLoggedUserId(this.externalReviewersRegistrationRequestInfo.module).subscribe({
            next: (response) => {
                if (response.data.externalReviewersActiveRegistrationRequestInfo) {
                    Object.assign(this.externalReviewersRegistrationRequestInfo, response.data.externalReviewersActiveRegistrationRequestInfo);
                }
            },
            error: err => {
            }
        })
    }
}
