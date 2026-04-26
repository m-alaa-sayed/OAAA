import {Permission} from "../enum/permission";

export interface UserClaim {
    userId: number;
    roles: string[];
    permissions: Permission[];
    procedures: string[];
}
