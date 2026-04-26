import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {BaseModal} from 'src/app/shared/base-modal';
import {ServiceStep} from "../../../../core/enum/service-step";
import {ExternalReviewerValidationService} from '../../services/external-reviewer-validation.service';
import {Criterion} from '../../types/acceptance-criteria/criterion';
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
    selector: 'app-external-reviewer-registration-request-actions',
    templateUrl: './external-reviewer-registration-request-actions.component.html',
    styleUrl: './external-reviewer-registration-request-actions.component.scss'
})
export class ExternalReviewerRegistrationRequestActionsComponent extends BaseModal {

    @Input() criterionList: Criterion[] = [];
    @Input() requestObject: any;
    @Output() actionEventEmitter = new EventEmitter<any>();
    @Output() validationEventEmitter = new EventEmitter<boolean>(false);

    mode!: ServiceStep;
    action: string | undefined;
    submitted = false;
    comment!: string;
    underReviewSteps: ServiceStep[] = [ServiceStep.CHEQA_ERR_UNDER_REVIEW, ServiceStep.CSEQA_ERR_UNDER_REVIEW, ServiceStep.OQF_ERR_UNDER_REVIEW, ServiceStep.CHEQA_ERRJ_UNDER_REVIEW, ServiceStep.CSEQA_ERRJ_UNDER_REVIEW, ServiceStep.OQF_ERRJ_UNDER_REVIEW]
    returnForEditSteps: ServiceStep[] = [ServiceStep.CHEQA_ERR_RETURN_FOR_EDIT, ServiceStep.CSEQA_ERR_RETURN_FOR_EDIT, ServiceStep.OQF_ERR_RETURN_FOR_EDIT, ServiceStep.CHEQA_ERRJ_RETURN_FOR_EDIT, ServiceStep.CSEQA_ERRJ_RETURN_FOR_EDIT, ServiceStep.OQF_ERRJ_RETURN_FOR_EDIT]

    constructor(public route: ActivatedRoute,
        public override modalService: NgbModal,
        public toastService: ToastService,
        public translate: TranslateService,
        public router: Router,
        private externalReviewerValidationService: ExternalReviewerValidationService
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        this.mode = this.requestObject.serviceStep.stepCode;
    }


    setAction(action: any, content: any) {
        this.action = action;
        if (this.handleSpecialErrorCases(action)) {
            this.comment = "";
            this.open(content);
        }
    }

    closePopup() {
        (this.comment = ''), (this.submitted = false);
        this.close();
    }

    sendAction() {
        if (!this.comment && (this.action == 'RETURN_FOR_EDIT' || this.action == 'REJECT')) {
            this.submitted = true;
        } else {
            this.close();
            this.actionEventEmitter.emit({ comment: this.comment, action: this.action })
        }
    }

    returnToList() {
        this.close();
        this.router.navigate(['/jawda/service-management/service-catalogue-list']);
    }

    handleSpecialErrorCases(event: any): boolean {
        const { stepCode } = this.requestObject.serviceStep;
        if (event == 'APPROVE') {
            if (
                !this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendation
                || !this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendationNotes
                || this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendationNotes.trim() === ''
                || (
                    this.requestObject.externalReviewersRegistrationRequestInfo.evaluationRecommendation == 'MET'
                    && this.requestObject.oaaaService.serviceCode == 'CHEQA'
                    && (
                        !this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList
                        || this.requestObject.externalReviewersRegistrationRequestInfo.recommendedActivityList.length == 0
                    )
                )
            ) {
                this.validationEventEmitter.emit(true)
                this.showErrorMessageAndEmit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS')
                return false;
            }
            if (!this.validateAllRequiredCriteria()) {
                this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
                this.showErrorMessageAndEmit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_IN_INIT_CRITERIA');
                return false;
            }
        }

        //--- handle qualification tab
        if (stepCode.includes('_RETURN_FOR_EDIT')) {
            return this.validateQualificationTab() && this.validateExperienceInformationTab()

        }
        return true;
    }


    private validateQualificationTab() {
        if (
            (!this.requestObject.externalReviewersRegistrationRequestInfo.insideOman
                && !this.requestObject.externalReviewersRegistrationRequestInfo.passportNo)
            || (this.requestObject.externalReviewersRegistrationRequestInfo.qualification.institution?.lookupIdentifier
                == 'INSTITUTIONS_OTHER' && !this.requestObject.externalReviewersRegistrationRequestInfo.qualification.otherInstitutionName)
            || (this.requestObject.externalReviewersRegistrationRequestInfo.module == 'CSEQA' &&
                !this.requestObject.externalReviewersRegistrationRequestInfo.qualification.cseqaGeneralSpecializationId)
            || (this.requestObject.externalReviewersRegistrationRequestInfo.module == 'CSEQA' &&
                this.requestObject.externalReviewersRegistrationRequestInfo.qualification.cseqaSpecificSpecializationId == '7' &&
                !this.requestObject.externalReviewersRegistrationRequestInfo.qualification.otherCseqaSpecificSpecialization)
            || (!this.requestObject.externalReviewersRegistrationRequestInfo.resumeSummary)
        ) {
            this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
            this.showErrorMessageAndEmit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_IN_QUALIFICATIONS')
            return false;
        }
        return true
    }

    private validateExperienceInformationTab() {
        switch (this.requestObject.externalReviewersRegistrationRequestInfo.module) {
            case 'CSEQA':
                return this.validateCSEQA()
            case 'CHEQA':
                return this.validateCHEQA();
            case 'OQF':
                return this.validateOQF();
            default:
                return true;
        }
    }


    private validateCSEQA() {
        if (!this.requestObject.externalReviewersRegistrationRequestInfo.sceqaExperience.schoolEducationSystemExperience) {
            this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
            this.showErrorMessageAndEmit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_IN_EXPERINCE')
            return false

        }
        if ((!this.requestObject.externalReviewersRegistrationRequestInfo.expertiseYearList
            || this.requestObject.externalReviewersRegistrationRequestInfo.expertiseYearList.length == 0)) {
            this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
            this.showErrorMessageAndEmit('PAGES.EXTERNAL_REVIEWER.MESSAGES.ADD_YEARS_OF_EXPERIENCE')
            return false;
        }

        return true;
    }

    private validateCHEQA() {
        const cheqaExperience = this.requestObject.externalReviewersRegistrationRequestInfo.cheqaExperience
        if (!cheqaExperience.qualityAssuranceExperience
            || !cheqaExperience.trainingOrExternalQaExperience || !cheqaExperience.externalReviewTeamParticipation
            || !cheqaExperience.programOrCourseDesignExperience
            || !cheqaExperience.currentOrPreviousTeachingExperience) {

            this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
            this.showErrorMessageAndEmit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_IN_EXPERINCE')
            return false
        }
        return true;
    }

    private validateOQF() {

        const oqfExperience = this.requestObject.externalReviewersRegistrationRequestInfo.oqfExperience
        if (!oqfExperience.qualificationReferencingExperience
            || !oqfExperience.oqfTrainingOrParticipation
            || !oqfExperience.nationalCriteriaApplicationAbility) {

            this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
            this.showErrorMessageAndEmit('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_IN_EXPERINCE');
            return false
        }
        return true;
    }


    private validateAllRequiredCriteria(): boolean {
        if (!this.criterionList?.length) return true;

        // Index scores by criteriaItemId for O(1) lookup instead of O(n)
        const scoreMap = new Map<number, any>();
        if (this.requestObject.externalReviewersRegistrationRequestInfo?.criteriaScoreList && this.requestObject.externalReviewersRegistrationRequestInfo?.criteriaScoreList.length) {
            for (const score of this.requestObject.externalReviewersRegistrationRequestInfo?.criteriaScoreList) {
                if (score.criteriaItemId != null) {
                    scoreMap.set(score.criteriaItemId, score);
                }
            }
        }

        for (const criteria of this.criterionList) {
            for (const sub of criteria.currentVersion.subCriteriaList) {
                for (const item of sub.items) {
                    if (!item.required) continue;

                    const score = scoreMap.get(item.id || 0);
                    const isValid = score && (
                        (item.type === 'NUMERIC' && score.criteriaItemValue !== null && score.criteriaItemValue !== undefined && score.criteriaItemValue !== '') ||
                        (item.type !== 'NUMERIC' && score.criteriaOptionId !== null && score.criteriaOptionId !== undefined)
                    );

                    if (!isValid) return false;
                }
            }
        }

        return true;
    }



    private showErrorMessageAndEmit(message: string) {
        this.externalReviewerValidationService.submitExternalReviewerRegistrationApprovalAction(true);
        this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
    }


    onTextChange(): void {
        const result = limitWords(this.comment || '', 250);
        this.comment = result.trimmedText;
    }
}
