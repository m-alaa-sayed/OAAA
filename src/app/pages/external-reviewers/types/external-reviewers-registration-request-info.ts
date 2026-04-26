import { Request } from "src/app/shared/types/request";
import { ExternalReviewer } from "./external-reviewer";
import { ExternalReviewerAttachments } from "./external-reviewer-attachments";
import { ExternalReviewerCheqaExperienceInformation } from "./external-reviewer-cheqa-experience-information";
import { ExternalReviewerCriteriaScores } from "./external-reviewer-criteria-scores";
import { ExternalReviewerExpertiseAreas } from "./external-reviewer-expertise-areas";
import { ExternalReviewerLanguageSkills } from "./external-reviewer-language-skills";
import { ExternalReviewerOqfExperienceInformation } from "./external-reviewer-oqf-experience-information";
import { ExternalReviewerQualifications } from "./external-reviewer-qualifications";
import { ExternalReviewerRecommendedActivities } from "./external-reviewer-recommended-activities";
import { ExternalReviewerSceqaExperienceInformation } from "./external-reviewer-sceqa-experience-information";
import { ExternalReviewersRegistrationRequestAcceptanceCriteria } from "./external-reviewers-registration-request-acceptance-criteria";
import {User} from "../../../core/models/auth.models";
import { ExternalReviewInterviewResultInfo } from "./external-reviewers-interview-result/external-review-interview-result-info";
import { ExternalReviewerExpertiseYears } from "./external-reviewer-expertise-years";

export interface ExternalReviewersRegistrationRequestInfo {

    id?: number;
    registrationStatus?: string;
    userId?: number;
    user?: User;
    module?: any;
    requestId?: number;
    request ?: Request;
    pledgeAccepted?: boolean;
    externalReviewerNotes?: string;
    resumeSummary?: string;
    evaluationRecommendation?: string;
    evaluatorUserId?: number;
    evaluationRecommendationNotes?: string;
    profilePictureBucketName?: string;
    profilePictureFileName?: string;
    totalScore?: number;
    passportNo?: string;
    passportBucketName?: string;
    passportFileName?: string;

    noObjectionCertificateBucketName?: string;
    noObjectionCertificateFileName?: string;
    
    arabicLanguageScore?: number;
    englishLanguageScore?: number;
    externalReviewersRegistrationSettingsId?: number;

    externalReviewer?: ExternalReviewer;
    attachmentList?: ExternalReviewerAttachments[];
    qualification: ExternalReviewerQualifications;
    criteriaScoreList?: ExternalReviewerCriteriaScores[];
    expertiseAreaList?: ExternalReviewerExpertiseAreas[];
    languageSkillList?: ExternalReviewerLanguageSkills[];
    cheqaExperience: ExternalReviewerCheqaExperienceInformation;
    oqfExperience: ExternalReviewerOqfExperienceInformation;
    sceqaExperience: ExternalReviewerSceqaExperienceInformation;
    acceptanceCriteriaList?: ExternalReviewersRegistrationRequestAcceptanceCriteria[];
    recommendedActivityList?: ExternalReviewerRecommendedActivities[];
    externalReviewInterviewResult ?:ExternalReviewInterviewResultInfo;

    expertiseYearList ?: ExternalReviewerExpertiseYears[];
    //- transient 
    insideOman?: boolean;
    serviceCode:string;
    externalReviewerTrainingResult?:any;
}
