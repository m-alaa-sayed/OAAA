import { User } from "src/app/core/models/auth.models";
import { ServiceStepAction } from "./service-step-action";

export interface RequestHistory {

    id?: number;
    requestId?: number;
    serviceStepActionId?: number;
    serviceStepAction?: ServiceStepAction;
    actionDate?: Date;
    userId?: number;
    user?: User;
    dataComment?: string;
}