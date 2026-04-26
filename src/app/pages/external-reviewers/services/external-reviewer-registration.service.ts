import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BroadField } from '../types/broad-field';
import { AppResponse } from 'src/app/core/models/app-response';
import { map } from 'rxjs';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { NarrowField } from '../types/narrow-field';
import { ExternalReviewersRegistrationRequest } from '../types/external-reviewers-registration-request';
import { Criterion } from '../types/acceptance-criteria/criterion';
import { GeneralSpecialization } from '../types/general-specialization';
import { SpecificSpecialization } from '../types/specific-specialization';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerRegistrationService {

  constructor(private http: HttpClient) { }



  getBroadFields() {
    return this.http.get<AppResponse<BroadField[]>>(`${AppConstants.API.BROAD_FIELDS}`)
      .pipe(map((ret) => ret.data));
  }


  getNarrowFields(id: number) {
    return this.http.get<AppResponse<NarrowField[]>>(`${AppConstants.API.NARROW_FIELDS}/${id}`)
      .pipe(map((ret) => ret.data));
  }


  getGeneralSpecific() {
    return this.http.get<AppResponse<GeneralSpecialization[]>>(`${AppConstants.API.GENERAL_SPECIALIZATIONS}`)
      .pipe(map((ret) => ret.data));
  }

  getSpecificSpecializations(id: number) {
    return this.http.get<AppResponse<SpecificSpecialization[]>>(`${AppConstants.API.SPECIFIC_SPECIALIZATIONS}/${id}`)
      .pipe(map((ret) => ret.data));
  }

  getCseqaGeneralSpecializations(isActive?: boolean) {
    let params: any = {};

    if (isActive !== undefined) {
      params.isActive = isActive;
    }

    return this.http.get<AppResponse<GeneralSpecialization[]>>(
      `${AppConstants.API.CSEQA_GENERAL_SPECIALIZATIONS}`, 
      { params }
    ).pipe(map((res) => res.data));
  }

  getCseqaSpecificSpecializations() {
    return this.http.get<AppResponse<SpecificSpecialization[]>>(`${AppConstants.API.CSEQA_SPECIFIC_SPECIALIZATIONS}`)
      .pipe(map((ret) => ret.data));
  }

  createRequest(serviceCode: string, dto: ExternalReviewersRegistrationRequest) {
    return this.http.post<any>(`${AppConstants.API.EXTERNAL_REVIEWERS_REGISTRATION_REQUEST}/${serviceCode}/create/`, dto);
  }



  getAllCriteriaWithCurrentVersions(module: string) {
    return this.http.get<AppResponse<Criterion[]>>(`${AppConstants.API.ALL_CRITERIA_WITH_CURRENT_VERSIONS}/current/${module}`);
  }
  getAllCriteriaWithCurrentVersionsByRequestInfoId(module: string,requestInfoId:any) {
    return this.http.get<AppResponse<Criterion[]>>(`${AppConstants.API.ALL_CRITERIA_WITH_CURRENT_VERSIONS}/current/${requestInfoId}/${module}`);
  }
}
