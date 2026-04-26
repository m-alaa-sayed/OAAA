import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppResponse } from 'src/app/core/models/app-response';
import { SelfEvaluationDocument } from '../types/self-evaluation-document';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { SelfEvaluationDocumentSetting } from '../types/self-evaluation-document-setting';
import { SelfEvaluationDocumentUpdateRequest } from '../types/self-evaluation-document-update-request';
import { Audit } from 'src/app/core/models/audit';
import { BasicSchoolInfo, PrincipalInfo, SchoolAboutData, SchoolInfo, SchoolSchedule, StudentCountByGender, StudentCountByStage, StudentRatios } from '../types/school-info';

@Injectable({
  providedIn: 'root'
})
export class SelfEvaluationDocumentService {

  constructor(private http: HttpClient) { }



  getSelfEvaluationDocumentList() {
    return this.http.get<AppResponse<SelfEvaluationDocument[]>>(`${AppConstants.API.SELF_EVALUATION_DOCUMENTS}`);
  }


  getSelfEvaluationDocumentById(selfEvaluationDocumentId: number) {
    return this.http.get<AppResponse<SelfEvaluationDocument>>(`${AppConstants.API.SELF_EVALUATION_DOCUMENTS}${selfEvaluationDocumentId}`);
  }


  getLatestSettingsForSelfEvaluationDocumentList() {
    return this.http.get<AppResponse<SelfEvaluationDocumentSetting>>(`${AppConstants.API.SELFE_VALUATION_DOCUMENT_SETTING}`);
  }


  updateSelfEvaluationDocument(selfEvaluationDocumentId: number, request: SelfEvaluationDocumentUpdateRequest) {
    return this.http.put<AppResponse<void>>(`${AppConstants.API.SELF_EVALUATION_DOCUMENTS}${selfEvaluationDocumentId}`,request);
  }

  getAvailabilityAudit(documentId: any) {
    return this.http.get<AppResponse<Audit[]>>(`${AppConstants.API.SELF_EVALUATION_DOCUMENTS}audit/${documentId}`);
  }

  validateSchoolInfo(schoolInfo:SchoolInfo): string {
    if(!this.validateBasicInfo(schoolInfo.basicInfo) 
      || !this.validatePrincipalInfo(schoolInfo.principalInfo)
      || !this.validateLocalSchoolSchedule(schoolInfo.localSchoolSchedule)){
      return "INVALID_GENERAL_DATA";
    }

    if(!this.validateStudentTab(schoolInfo.studentCountByGender,schoolInfo.studentCountByStage,schoolInfo.studentRatios)){
      return "INVALID_STUDENT_TAB";
    }

    if(!this.validateAboutSchool(schoolInfo.schoolAboutData)){
      return "INVALID_ABOUT_SCHOOL_DATA";
    }
    
    return "VALID";
  }

validateBasicInfo(basicInfo: BasicSchoolInfo): boolean {
    const keys: (keyof BasicSchoolInfo)[] = [
      'schoolCode', 'arSchoolName', 'enSchoolName', 'schoolType', 'studentGender',
      'address', 'village', 'email', 'website',
      'tel1', 'buildDate', 'isSpecialClass','governorateId', 'wilayatId'
    ];

    for (const key of keys) {
      const value = basicInfo[key];

      if (value === null || value === undefined || value.toString().trim() === '') {
        console.warn(`Field ${key} is empty or null`);
        return false;
      }
    }

  return true;
}

validatePrincipalInfo(principalInfo: PrincipalInfo): boolean {
    const keys: (keyof PrincipalInfo)[] = [
      'principalName', 'principalPhone', 'principalEmail',
      'assistantPrincipal1', 'assistantPrincipal1Phone','assistantPrincipal1Email',
      'assistantPrincipal2', 'assistantPrincipal2Phone','assistantPrincipal2Email'
    ];

    for (const key of keys) {
      const value = principalInfo[key];

      if (value === null || value === undefined || value.toString().trim() === '') {
        console.warn(`Field ${key} is empty or null`);
        return false;
      }
    }

  return true;
}

validateLocalSchoolSchedule(localSchoolSchedule: SchoolSchedule): boolean {
    const keys: (keyof SchoolSchedule)[] = [
      'startTime', 'endTime'
    ];

    for (const key of keys) {
      const value = localSchoolSchedule[key];

      if (value === null || value === undefined || value.toString().trim() === '') {
        console.warn(`Field ${key} is empty or null`);
        return false;
      }
    }

  return true;
}

validateStudentTab(
  studentCountByGender: StudentCountByGender,
  studentCountByStage: StudentCountByStage,
  studentRatios:StudentRatios
): boolean {
  if (studentCountByGender.males == null) return false;  
  if (studentCountByGender.females == null) return false;

  if (studentCountByStage.stage1to4 == null) return false;
  if (studentCountByStage.stage5to8 == null) return false;
  if (studentCountByStage.stage9to12 == null) return false;

  if (studentRatios.nonOmaniStudentsRatio == null) return false;

  return true;
}

validateAboutSchool(schoolAboutData: SchoolAboutData): boolean {
    const keys: (keyof SchoolAboutData)[] = [
      'vision', 'mission','strategicGoals','generalOverview','majorDevelopments'
    ];

    for (const key of keys) {
      const value = schoolAboutData[key];

      if (value === null || value === undefined || value.toString().trim() === '') {
        return false;
      }
    }

  return true;
}


}

