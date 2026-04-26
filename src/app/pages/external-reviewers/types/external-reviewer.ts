import {ExternalReviewersRegistrationRequestInfo} from "./external-reviewers-registration-request-info";

export interface ExternalReviewer {

    id?: number;
    userId?: number;
    status?: string;
    isAvailable?: boolean;
    allowRegistrationRequests?: boolean;
    module?: string;

    statusUpdateNotes?: string;
    joiningDate?: Date;
    lastDataUpdatedDate?: Date;
    activeRegistrationRequestInfoId?: Date;
    externalReviewersActiveRegistrationRequestInfo?: ExternalReviewersRegistrationRequestInfo;
    contribution?:string;

    availabilityChangeReasons?: string;
    availabilityChangeFileBucketName?: string;
    availabilityChangeFileName?: string;


    //-- transient
    currentIsAvailable?: boolean;
}
