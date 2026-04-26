import { User } from "src/app/store/Authentication/auth.models";

export class QaFollowUpFormComment {
  id?: number;
  comment?: string;
  createdBy?: number;
  user?: User;
  createdOn?: string; // ISO date-time string
  updatedBy?: number;
  updatedOn?: string; // ISO date-time string
}
