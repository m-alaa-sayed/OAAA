import {User} from "src/app/store/Authentication/auth.models";

export interface SchoolDocumentDeliveryItem {
    id: number | null;
    documentName: string | null;
    documentType: string | null;
    description: string | null;
    deliveryDate: string | null;
    deliveredById: number | null;
    deliveredBy: any;
    deliveryStatus: string | null;
    receivingDate: string | null;
    receivedById: number | null;
    receivedBy: any;
    isReceived: boolean;
    notes: string | null;
    documentBucketName?: string | null;
    documentFileName?: string | null;
    createdBy: number | null;
    user: User | null;
    createdOn: string | null;
    updatedBy: number | null;
    updatedOn: string | null;
    isNew: boolean;
    submitStatus: string | null;
}