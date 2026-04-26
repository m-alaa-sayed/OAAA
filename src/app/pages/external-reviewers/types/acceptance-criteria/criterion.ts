import {CriterionVersion} from "./criterion-version";

export interface Criterion {
    id: number;
    code: String;
    module: string;
    currentVersion: CriterionVersion;
    latestVersion: CriterionVersion;
    requestedVersion: CriterionVersion;

 
}