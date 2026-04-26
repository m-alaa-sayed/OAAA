import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppConstants } from '../../../core/constants/app-constants';
import { AppResponse } from '../../../core/models/app-response';
import { School } from '../types/school';
import {BasicSchoolInfo} from "../types/school-info";

export interface SchoolBasicInfo {
  id: string;
  schoolcode: string;
  arSchoolName: string;
  enSchoolName: string;
  schoolType: string;
  studentGender: string;
  address: string;
  governorate: string;
  wilayat: string;
  vilage: string;
  email: string;
  tel1: string;
  buildDate: string;
  schoolStartYear: string;
  isSpecialClass: string;
  schoolOperatingHours: string;
}

export interface SchoolContactInfo {
  mainPhone: string;
  fax: string;
  email: string;
  alternatePhone: string;
}

export interface SchoolPrincipalInfo {
  principalName: string;
  assistantPrincipal1: string;
  assistantPrincipal2: string;
  principalPhone: string;
  principalEmail: string;
  assistantPrincipal1Phone: string;
  assistantPrincipal1Email: string;
  assistantPrincipal2Phone: string;
  assistantPrincipal2Email: string;
}

export interface SchoolSchedule {
  startTime: string;
  endTime: string;
  workingDays: string[];
  totalHoursPerWeek: number;
}

export interface SchoolGradeLevels {
  kg: boolean;
  grade1: boolean;
  grade2: boolean;
  grade3: boolean;
  grade4: boolean;
  grade5: boolean;
  grade6: boolean;
  grade7: boolean;
  grade8: boolean;
  grade9: boolean;
  grade10: boolean;
  grade11: boolean;
  grade12: boolean;
}

export interface SchoolAdditionalInfo {
  schoolVision: string;
  schoolMission: string;
  specialPrograms: string;
  isSpecialNeeds: boolean;
  totalStudents: number;
  totalTeachers: number;
  establishmentHistory: string;
  lastInspectionDate: string;
  accreditationStatus: string;
  schoolStatus: string;
}

export interface SchoolContactDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
}

export interface SchoolData {
  basicInfo: SchoolBasicInfo;
  contactInfo: SchoolContactInfo;
  principalInfo: SchoolPrincipalInfo;
  schoolSchedule: SchoolSchedule;
  gradeLevels: SchoolGradeLevels;
  additionalInfo: SchoolAdditionalInfo;
  contactDetails: SchoolContactDetails[];
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class SchoolDataService {

  // BehaviorSubject to share school data between components
  private currentSchoolDataSubject = new BehaviorSubject<SchoolData | null>(null);
  public currentSchoolData$ = this.currentSchoolDataSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Set current school data (for sharing between components)
   */
  setCurrentSchoolData(schoolData: SchoolData): void {
    this.currentSchoolDataSubject.next(schoolData);
  }

  /**
   * Get current school data
   */
  getCurrentSchoolData(): SchoolData | null {
    return this.currentSchoolDataSubject.value;
  }

  /**
   * Map School data from self-evaluation-document to SchoolBasicInfo
   */
  mapSchoolToBasicInfo(school: School): SchoolBasicInfo {
    return {
      id: school.id?.toString() || '',
      schoolcode: school.code || '',
      arSchoolName: school.nameAr || '',
      enSchoolName: school.nameEn || '',
      schoolType: school.type || '',
      studentGender: school.gender || '',
      address: '', // Not available in School interface
      governorate: school.governorate?.nameAr || '',
      wilayat: school.wilayat?.nameAr || '',
      vilage: '', // Not available in School interface
      email: school.email || '',
      tel1: '', // Not available in School interface
      buildDate: '', // Not available in School interface
      schoolStartYear: '', // Not available in School interface
      isSpecialClass: '', // Not available in School interface
      schoolOperatingHours: '' // Not available in School interface
    };
  }

  /**
   * Get school data by school ID
   */
  getSchoolData(schoolId: string): Observable<SchoolData> {
    // For now, return mock data. In production, this would call the actual API
    return of(this.getMockSchoolData(schoolId));
    
    // Uncomment when API is ready:
    // return this.http.get<AppResponse<SchoolData>>(`${AppConstants.API.SCHOOL_DATA}/${schoolId}`, httpOptions)
    //   .pipe(map(response => response.data));
  }

  /**
   * Save school data
   */
  saveSchoolData(schoolId: string, data: SchoolData): Observable<void> {
    // For now, just log the data. In production, this would call the actual API
    console.log('Saving school data:', { schoolId, data });
    return of(void 0);
    
    // Uncomment when API is ready:
    // return this.http.put<void>(`${AppConstants.API.SCHOOL_DATA}/${schoolId}`, data, httpOptions);
  }

  /**
   * Get school basic info
   */
  getSchoolBasicInfo(schoolId: string): Observable<SchoolBasicInfo> {
    return this.getSchoolData(schoolId).pipe(
      map(data => data.basicInfo)
    );
  }

  /**
   * Save school basic info
   */
  saveSchoolBasicInfo(schoolId: string, basicInfo: BasicSchoolInfo): Observable<void> {
    return this.getSchoolData(schoolId).pipe(
      map(data => {
        // data.basicInfo = basicInfo;
        return data;
      }),
      switchMap(data => this.saveSchoolData(schoolId, data))
    );
  }

  /**
   * Get school list (for navigation)
   */
  getSchoolList(): Observable<any[]> {
    // Mock school list
    const schools = [
      {
        id: '1',
        schoolName: 'مدرسة وطني',
        schoolCode: 'ث م 432',
        schoolType: 'حكومي',
        province: 'مسقط',
        state: 'بوشر'
      },
      {
        id: '2',
        schoolName: 'مدرسة الخيرة',
        schoolCode: 'ل خ 5326',
        schoolType: 'خاصة',
        province: 'مسقط',
        state: 'بوشر'
      }
    ];
    return of(schools);
  }

  private getMockSchoolData(schoolId: string): SchoolData {
    const mockData: SchoolData = {
      basicInfo: {
        id: schoolId,
        schoolcode: schoolId === '1' ? 'ث م 432' : 'ل خ 5326',
        arSchoolName: schoolId === '1' ? 'مدرسة وطني' : 'مدرسة الخيرة',
        enSchoolName: schoolId === '1' ? 'Al Watani School' : 'Al Khayra School',
        schoolType: schoolId === '1' ? 'government' : 'private',
        studentGender: 'mixed',
        address: 'شارع السلطان قابوس، مسقط',
        governorate: 'muscat',
        wilayat: 'bausher',
        vilage: 'الخوير',
        email: schoolId === '1' ? 'watani@edu.om' : 'khayra@edu.om',
        tel1: schoolId === '1' ? '+968 2445 1234' : '+968 2445 5678',
        buildDate: '2010-01-01',
        schoolStartYear: '2010',
        isSpecialClass: 'false',
        schoolOperatingHours: '7:00 AM - 2:00 PM'
      },
      contactInfo: {
        mainPhone: schoolId === '1' ? '+968 2445 1234' : '+968 2445 5678',
        fax: schoolId === '1' ? '+968 2445 1235' : '+968 2445 5679',
        email: schoolId === '1' ? 'info@watani.edu.om' : 'info@khayra.edu.om',
        alternatePhone: schoolId === '1' ? '+968 2445 1236' : '+968 2445 5680'
      },
      principalInfo: {
        principalName: schoolId === '1' ? 'أحمد محمد علي' : 'فاطمة عبدالله سالم',
        assistantPrincipal1: schoolId === '1' ? 'علي حسن محمد' : 'خالد عبدالرحمن',
        assistantPrincipal2: schoolId === '1' ? 'سارة أحمد محمد' : 'مريم سعيد علي',
        principalPhone: schoolId === '1' ? '+968 2445 1237' : '+968 2445 5681',
        principalEmail: schoolId === '1' ? 'principal@watani.edu.om' : 'principal@khayra.edu.om',
        assistantPrincipal1Phone: schoolId === '1' ? '+968 2445 1238' : '+968 2445 5682',
        assistantPrincipal1Email: schoolId === '1' ? 'assistant1@watani.edu.om' : 'assistant1@khayra.edu.om',
        assistantPrincipal2Phone: schoolId === '1' ? '+968 2445 1239' : '+968 2445 5683',
        assistantPrincipal2Email: schoolId === '1' ? 'assistant2@watani.edu.om' : 'assistant2@khayra.edu.om'
      },
      schoolSchedule: {
        startTime: '07:00',
        endTime: '14:00',
        workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        totalHoursPerWeek: 35
      },
      gradeLevels: {
        kg: true,
        grade1: true,
        grade2: true,
        grade3: true,
        grade4: true,
        grade5: true,
        grade6: true,
        grade7: true,
        grade8: true,
        grade9: true,
        grade10: true,
        grade11: true,
        grade12: true
      },
      additionalInfo: {
        schoolVision: 'تطوير جيل مبدع ومبتكر قادر على مواجهة تحديات المستقبل',
        schoolMission: 'تقديم تعليم عالي الجودة يلبي احتياجات المجتمع ويطور قدرات الطلاب',
        specialPrograms: 'برامج الموهوبين، برامج الدعم التعليمي، الأنشطة الرياضية والفنية',
        isSpecialNeeds: true,
        totalStudents: schoolId === '1' ? 850 : 650,
        totalTeachers: schoolId === '1' ? 45 : 35,
        establishmentHistory: 'تأسست المدرسة في عام 2010 وتطورت عبر السنوات لتشمل جميع المراحل التعليمية',
        lastInspectionDate: '2023-06-15',
        accreditationStatus: 'معتمدة',
        schoolStatus: 'active'
      },
      contactDetails: [
        {
          id: 1,
          name: schoolId === '1' ? 'أحمد محمد علي' : 'فاطمة عبدالله سالم',
          email: schoolId === '1' ? 'ahmed.ali@watani.edu.om' : 'fatima.salem@khayra.edu.om',
          phone: schoolId === '1' ? '+968 2445 1237' : '+968 2445 5681',
          position: 'مدير المدرسة',
          department: 'الإدارة العامة'
        },
        {
          id: 2,
          name: schoolId === '1' ? 'علي حسن محمد' : 'خالد عبدالرحمن',
          email: schoolId === '1' ? 'ali.hassan@watani.edu.om' : 'khalid.abdulrahman@khayra.edu.om',
          phone: schoolId === '1' ? '+968 2445 1238' : '+968 2445 5682',
          position: 'وكيل المدرسة',
          department: 'الإدارة العامة'
        }
      ]
    };

    return mockData;
  }
} 
