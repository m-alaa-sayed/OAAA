import { User } from "src/app/core/models/auth.models";
import { ServiceStep } from "./service-step";
import { RequestHistory } from "./request-history";
import { RequestAttachment } from "./request-attachment";
import { OaaaService } from "./oaaa-service";

export interface Request {

    id?: number;
    requestDate?: Date;
    applicantUserId?: number;
    applicantUser?: User;
    oaaaService?: OaaaService;
    oaaaServiceId?: number;
    applicationNo?: string;
    serviceStep?: ServiceStep;
    serviceStepId?: number;
    notes?: string;
    requestHistoryList?: RequestHistory[];
    requestAttachmentList?: RequestAttachment[];

    // From Camunda Task
    taskId?: string;
    currentTask?: string;
    assignedDate?: Date;
    processInstanceId?: string;
      slaAssigneeRole?:string;

}