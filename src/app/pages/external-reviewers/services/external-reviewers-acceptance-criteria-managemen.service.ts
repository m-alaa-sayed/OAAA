import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { AppResponse } from "../../../core/models/app-response";
import { Criterion } from "../types/acceptance-criteria/criterion";
import { AppConstants } from "../../../core/constants/app-constants";
import { CriterionVersion } from "../types/acceptance-criteria/criterion-version";
import { CriterionSubCriteria } from "../types/acceptance-criteria/criterion-sub-criteria";
import { CriterionItem } from "../types/acceptance-criteria/criterion-item";
import { Audit } from "../../../core/models/audit";
import {
    ExternalReviewerAcceptanceCriterionAttachment
} from "../types/acceptance-criteria/external-reviewer-acceptance-criterion-attachment";

@Injectable({
    providedIn: 'root'
})
export class ExternalReviewersAcceptanceCriteriaManagemenService {

    constructor(private http: HttpClient) {
    }

    // main
    getAllCriteriaWithLatestVersions(module: string) {
        return this.http.get<AppResponse<Criterion[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/${module}`)
            .pipe(map((ret) => {
                let dtos: Criterion[] = ret.data;
                dtos.forEach(dto => dto.latestVersion.criterionId = dto.id)
                return dtos;
            }));
    }

    publishVersion(module: string, versionId?: number) {
        return this.http.get<AppResponse<Criterion>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/publish/${module}/${versionId}`)
            .pipe(map((ret) => ret.data));
    }

    createCriterion(module: string, dto: CriterionVersion) {
        return this.http.post<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/${module}`, dto);
    }

    updateCriterion(module: string, dto: CriterionVersion) {
        return this.http.put<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/${module}`, dto);
    }

    deleteCriterion(module: string, id: number) {
        return this.http.delete<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/${module}/${id}`);
    }

    getCriterionById(module: string, criterionId?: number) {
        return this.http.get<AppResponse<Criterion>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/${module}/${criterionId}`)
            .pipe(map((ret) => ret.data));
    }

    getCriterionByIdAndVersionId(module: string, criterionId?: number, versionId?: number) {
        return this.http.get<AppResponse<Criterion>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/${module}/${criterionId}/${versionId}`)
            .pipe(map((ret) => ret.data));
    }

    getExternalReviewerAcceptanceCriterionAttachments(module: string) {
        return this.http.get<AppResponse<ExternalReviewerAcceptanceCriterionAttachment[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/documnet/${module}`)
            .pipe(map((ret) => ret.data));
    }

    addExternalReviewerAcceptanceCriterionAttachment(module: string, doc: ExternalReviewerAcceptanceCriterionAttachment) {
        return this.http.post<AppResponse<ExternalReviewerAcceptanceCriterionAttachment[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/documnet/${module}`, doc);
    }

    deleteExternalReviewerAcceptanceCriterionAttachment(module: string, id: number) {
        return this.http.delete<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/documnet/${module}/${id}`);
    }


    getAuditByModule(module: string) {
        return this.http.get<AppResponse<Audit[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/audit/${module}`)
            .pipe(map((ret) => ret.data));
    }

    getAuditByModuleAndCriterionId(module: string, criterionId?: number) {
        return this.http.get<AppResponse<Audit[]>>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA}/audit/${module}/${criterionId}`)
            .pipe(map((ret) => ret.data));
    }

    // SubCriterion
    createSubCriterion(dto: CriterionSubCriteria) {
        return this.http.post<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_SUB_CRITERIA}`, dto);
    }

    updateSubCriterion(dto: CriterionSubCriteria) {
        return this.http.put<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_SUB_CRITERIA}`, dto);
    }

    deleteSubCriterion(subCriterionId: number, criterionId?: number) {
        return this.http.delete<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_SUB_CRITERIA}/${criterionId}/${subCriterionId}`);
    }

    // item
    createItem(dto: CriterionItem) {
        return this.http.post<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_ITEMS}`, dto);
    }

    updateItem(dto: CriterionItem) {
        return this.http.put<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_ITEMS}`, dto);
    }

    deleteItem(id: number, criterionId?: number) {
        return this.http.delete<void>(`${AppConstants.API.EXTERNAL_REVIEWERS_ACCEPTANCE_ITEMS}/${criterionId}/${id}`);
    }

}
