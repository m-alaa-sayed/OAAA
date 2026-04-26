import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SchoolDataService, SchoolData } from '../service/school-data.service';
import { SelfEvaluationDocument } from '../types/self-evaluation-document';

@Component({
  selector: 'school-performance-layout',
  templateUrl: './school-performance-layout.component.html',
  styleUrls: ['./school-performance-layout.component.scss']
})
export class SchoolPerformanceLayoutComponent implements OnInit {

  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
  @Input() isEditable: boolean = false;

  activeTab: string = 'general-data';
  private referrerUrl: string = '';

  tabs = [
    {
      id: 'general-data',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.GENERAL_SCHOOL_DATA',
      route: 'general-data'
    },
    {
      id: 'student-data',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.STUDENT_DATA',
      route: 'student-data'
    },
    {
      id: 'teaching-staff',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.TEACHING_STAFF_NUMBERS',
      route: 'teaching-staff'
    },
    {
      id: 'staff-data',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.STAFF_DATA',
      route: 'staff-data'
    },
    {
      id: 'about-school',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.ABOUT_SCHOOL',
      route: 'about-school'
    },
    {
      id: 'facilities',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.SCHOOL_FACILITIES',
      route: 'facilities'
    },
    {
      id: 'educational-programs',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.EDUCATIONAL_PROGRAMS',
      route: 'educational-programs'
    },
    {
      id: 'school-activities',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.SCHOOL_ACTIVITIES',
      route: 'school-activities'
    },
    {
      id: 'special-needs',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.SPECIAL_EDUCATIONAL_NEEDS',
      route: 'special-needs'
    },
    {
      id: 'gifted-students',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.GIFTED_STUDENTS',
      route: 'gifted-students'
    },
    {
      id: 'national-tests',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.NATIONAL_TESTS',
      route: 'national-tests'
    },
    {
      id: 'academic-achievement',
      label: 'PAGES.SCHOOL_PERFORMANCE.INTERNATIONAL_TESTS.TITLE',
      route: 'academic-achievement'
    },
    {
      id: 'mastery-rates',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.MASTERY_RATES',
      route: 'mastery-rates'
    },
    {
      id: 'achievement-distribution',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.ACHIEVEMENT_DISTRIBUTION',
      route: 'achievement-distribution'
    },
    {
      id: 'cohort-tracking',
      label: 'PAGES.SCHOOL_PERFORMANCE.TABS.COHORT_TRACKING',
      route: 'cohort-tracking'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private schoolDataService: SchoolDataService
  ) { }

  ngOnInit(): void {
  }


  getGovernorateName(): string {
    const currentLang = this.translate.currentLang;
    const governorate = this.selfEvaluationDocument.scheduledSchoolVisit?.school?.governorate;

    if (!governorate) return '';

    if (currentLang === 'en') {
      return governorate.nameEn || governorate.nameAr || '';
    } else {
      return governorate.nameAr || governorate.nameEn || '';
    }
  }

  getWilayatName(): string {
    const currentLang = this.translate.currentLang;
    const wilayat = this.selfEvaluationDocument.scheduledSchoolVisit?.school?.wilayat;

    if (!wilayat) return '';

    if (currentLang === 'en') {
      return wilayat.nameEn || wilayat.nameAr || '';
    } else {
      return wilayat.nameAr || wilayat.nameEn || '';
    }
  }

  selectTab(tab: any): void {
    scrollTo(0, 0);
    this.activeTab = tab.id;
    //this.router.navigate([tab.route], { relativeTo: this.route });
  }


  private storeReferrerUrl(): void {
    // Try to get referrer URL from router state first
    const navigation = this.router.getCurrentNavigation();
    const previousUrl = navigation?.previousNavigation?.finalUrl?.toString();

    if (previousUrl && !previousUrl.includes('/performance-dashboard/')) {
      this.referrerUrl = previousUrl;
    } else if (document.referrer && !document.referrer.includes('/performance-dashboard/')) {
      // Extract the path from full URL
      try {
        const url = new URL(document.referrer);
        this.referrerUrl = url.pathname;
      } catch {
        this.referrerUrl = document.referrer;
      }
    } else {
      // Fallback - use school ID if available
      const fallbackId = this.selfEvaluationDocument.scheduledSchoolVisit?.school?.id || '1';
      this.referrerUrl = `/jawda/school-performance/self-evaluation-document/creation/${fallbackId}`;
    }

    console.log('Stored referrer URL:', this.referrerUrl);
  }







} 