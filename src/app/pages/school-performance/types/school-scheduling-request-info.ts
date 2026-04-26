import { SchoolSchedulingRequest } from "./school-scheduling-request";

export interface SchoolSchedulingRequestInfo {
    id?: number;
    requestId?: number;
    request?: SchoolSchedulingRequest;
    academicYear?: string;
    semester?: string;
    allowedDays?: string[];
    visitPeriodStart?: string; // ISO date string: 'YYYY-MM-DD'
    visitPeriodEnd?: string;   // ISO date string: 'YYYY-MM-DD'
    excludedPeriods?: { [key: string]: any }; // Map<String, Object>
    schoolType?: string;
    governmentId?: number;
    wilayaId?: number;
    buildingOperationFrom?: string; // ISO date
    buildingOperationTo?: string;   // ISO date
    studentCountFrom?: number;
    studentCountTo?: number;
    grades?: string[];
    visitCountFrom?: number;
    visitCountTo?: number;
    lastVisitFrom?: string; // ISO date
    lastVisitTo?: string;   // ISO date
    monthsSinceLastVisitFrom?: number;
    monthsSinceLastVisitTo?: number;
    lastGeneralJudgment?: string;
}
