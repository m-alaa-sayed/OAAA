import {SchoolDocumentDeliveryItem} from "./school-document-delivery-item";
import {User} from "src/app/store/Authentication/auth.models";
import {ScheduledSchoolVisit} from "./scheduled-school-visit";

export interface SchoolDocumentDelivery {
    id: number;
    requestId: number;
    scheduledSchoolVisitId: number;
    scheduledSchoolVisit: ScheduledSchoolVisit;
    schoolDocumentDeliveryItems: SchoolDocumentDeliveryItem[];
    createdBy: number;
    user: User;
    createdOn: string;
    updatedBy: number;
    updatedOn: string;
}