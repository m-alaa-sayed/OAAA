import {Component, OnInit} from '@angular/core';
import {StepItem} from 'src/app/shared/wizard-template/step-item';
import {
    SelfEvaluationDocumentAttachmentsStepComponent
} from './steps/self-evaluation-document-attachments-step/self-evaluation-document-attachments-step.component';
import {
    SelfEvaluationDocumentPledgeStepComponent
} from './steps/self-evaluation-document-pledge-step/self-evaluation-document-pledge-step.component';
import {
    SelfEvaluationDocumentSchoolInfoStepComponent
} from './steps/self-evaluation-document-school-info-step/self-evaluation-document-school-info-step.component';
import {
    SelfEvaluationDocumentSelfEvalStepComponent
} from './steps/self-evaluation-document-self-eval-step/self-evaluation-document-self-eval-step.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {SelfEvaluationDocumentService} from '../../service/self-evaluation-document.service';
import {SelfEvaluationDocument} from '../../types/self-evaluation-document';
import {forkJoin} from 'rxjs';
import {SelfEvaluationDocumentSetting} from '../../types/self-evaluation-document-setting';
import {SchoolDataService} from '../../service/school-data.service';
import {SchoolInfo} from "../../types/school-info";
import { Permission } from 'src/app/core/enum/permission';

@Component({
    selector: 'self-evaluation-document-creation',
    templateUrl: './self-evaluation-document-creation.component.html',
    styleUrl: './self-evaluation-document-creation.component.scss'
})
export class SelfEvaluationDocumentCreationComponent implements OnInit {
    readonly Permission = Permission;

    selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
    selfEvaluationDocumentSetting: SelfEvaluationDocumentSetting = {} as SelfEvaluationDocumentSetting;
    id !: number;
    showTabs: boolean = false;

    selfEvalMainData: any;

    //-- inputs
    declarationTabInputs = new Map<string, any>();
    selfEvaluationDocumentSchoolInfoTabInputs = new Map<string, any>();
    selfEvaluationDocumentSelfEvalTabInputs = new Map<string, any>();
    dSelfEvaluationDocumentAttachmentsTabInputs = new Map<string, any>();

    steps: StepItem[] = [
        {
            labelAr: 'المقدمة',
            labelEn: 'Introduction',
            component: SelfEvaluationDocumentPledgeStepComponent,
            inputs: this.declarationTabInputs
        },
        {
            labelAr: 'بيانات المدرسة',
            labelEn: 'School Information',
            component: SelfEvaluationDocumentSchoolInfoStepComponent,
            inputs: this.selfEvaluationDocumentSchoolInfoTabInputs
        },
        {
            labelAr: 'التقويم الذاتى',
            labelEn: 'Self Evaluation',
            component: SelfEvaluationDocumentSelfEvalStepComponent,
            inputs: this.selfEvaluationDocumentSelfEvalTabInputs
        },
        {
            labelAr: 'المرفقات',
            labelEn: 'Attachments',
            component: SelfEvaluationDocumentAttachmentsStepComponent,
            inputs: this.dSelfEvaluationDocumentAttachmentsTabInputs
        }
    ];

    constructor(
        public translate: TranslateService,
        private route: ActivatedRoute,
        public toastService: ToastService,
        private selfEvaluationDocumentService: SelfEvaluationDocumentService,
        private schoolDataService: SchoolDataService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
        this.getSelfEvaluationDocumentById();
    }

    print() {
        const oldTitle = document.title;
        
        // Build the document name
        const schoolName = this.translate.currentLang === 'en' 
            ? this.selfEvaluationDocument.scheduledSchoolVisit?.school?.nameEn 
            : this.selfEvaluationDocument.scheduledSchoolVisit?.school?.nameAr;
        const docNumber = this.selfEvaluationDocument.documentNumber || 'N/A';
        const reportTitle = `Self Evaluation Document Report – ${schoolName} – Doc. ${docNumber}`;
        
        document.title = reportTitle;
        
        // Add CSS with custom headers and footers
        const style = document.createElement('style');
        style.id = 'print-hide-header-footer';
        style.innerHTML = `
            @page {
                size: A4 !important;
                margin: 2cm 1.6cm !important;
                
                @top-left {
                    content: "${this.translate.currentLang === 'ar' ? 'منصة جودة' : 'JAWDA Platform'} \\A ${this.translate.currentLang === 'ar' ? 'التاريخ' : 'Date'}: ${new Date().toLocaleDateString('en-US', { year: 'numeric' , day: '2-digit', month: '2-digit',  })} \\A ${this.translate.currentLang === 'ar' ? 'الوقت' : 'Time'}: ${new Date().toLocaleTimeString(this.translate.currentLang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}";
                    font-size: 11pt;
                    font-family: Arial, sans-serif;
                    white-space: pre-line;
                }
                @top-center {
                    content: "${this.translate.currentLang === 'ar' ? 'وثيقة التقويم الذاتي' : 'Self Evaluation Document'}";
                    font-size: 11pt;
                    font-weight: bold;
                    font-family: Arial, sans-serif;
                    white-space: pre-line;
                    text-align: center;
                }
                @top-right {
                    content: "${this.translate.currentLang === 'ar' ? 'الهيئة العمانية للاعتماد الأكاديمي و ضمان جودة التعليم' : 'Oman Academic Accreditation Authority'}";
                    font-size: 11pt;
                    font-weight: bold;
                    font-family: Arial, sans-serif;
                    text-align: center;
                    width: 150px;
                }
                
                @bottom-right {
                    content: ""counter(page) " / " counter(pages);
                    font-size: 9pt;
                    color: #666;
                }
            }
            
            @media print {
                body {
                    margin: 0 !important;
                }
                
                html, body {
                    font-size: 12px !important;
                    line-height: 1.5 !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        window.print();
        document.title = oldTitle;
        
        // Remove the style after printing
        setTimeout(() => {
            const styleElement = document.getElementById('print-hide-header-footer');
            if (styleElement) {
                styleElement.remove();
            }
        }, 1000);
    }


    initializeSchoolInfo(): SchoolInfo {
        return {
            id: '',
            basicInfo: {
                id: '',
                schoolCode: '',
                arSchoolName: '',
                enSchoolName: '',
                schoolType: '',
                studentGender: '',
                address: '',
                governorate: '',
                wilayat: '',
                village: '',
                email: '',
                website: '',
                tel1: '',
                buildDate: '',
                schoolStartYear: '',
                isSpecialClass: '',
                schoolOperatingHours: '',
                governorateId: 1,
                wilayatId: 1

            },
            contactInfo: {
                mainPhone: '',
                fax: '',
                email: '',
                alternatePhone: ''
            },
            principalInfo: {
                principalName: '',
                assistantPrincipal1: '',
                assistantPrincipal2: '',
                principalPhone: '',
                principalEmail: '',
                assistantPrincipal1Phone: '',
                assistantPrincipal1Email: '',
                assistantPrincipal2Phone: '',
                assistantPrincipal2Email: ''
            },
            localSchoolSchedule: {
                startTime: '',
                endTime: '',
                workingDays: [],
                totalHoursPerWeek: 0
            },
            gradeLevels: {
                kg: false,
                grade1: false,
                grade2: false,
                grade3: false,
                grade4: false,
                grade5: false,
                grade6: false,
                grade7: false,
                grade8: false,
                grade9: false,
                grade10: false,
                grade11: false,
                grade12: false
            },
            additionalInfo: {
                schoolVision: '',
                schoolMission: '',
                specialPrograms: '',
                isSpecialNeeds: false,
                totalStudents: 0,
                totalTeachers: 0,
                establishmentHistory: '',
                lastInspectionDate: '',
                accreditationStatus: '',
                schoolStatus: ''
            },
            contactDetails: [],
            privateSchoolInfo: {
                ownerName: '',
                ownerNumber: '',
                appliedCurriculum: '',
                internationalProgram: '',
                accreditationBody: '',
                accreditationDate: ''
            },
            studentCountByGender: {
                males: 0,
                females: 0,
                total: 0
            },
            averageSchoolDensity:0,
            studentCountByStage: {
                stage1to4: 0,
                stage5to8: 0,
                stage9to12: 0
            },
            studentRatios: {
                studentToTeacherRatio: 0,
                nonOmaniStudentsRatio: 0,
                maleStudentsRatio: 0,
                femaleStudentsRatio: 0,
                averageStudentsPerClass: 0
            },
            gradeData: [],
            administrativeStaffData: [],
            teachingStaffData: [],
            subjectTeachersData: [],
            teacherStudentRatio:0,
            teachingStaffTurnoverRate:0,
            teachingStaffRatios: {
                teacherToStudentRatio: 0,
                teachingEnvironmentProgressRate: 0
            },
            staffData: [],
            additionalStaffData: {
                numberOfGuards: 0,
                numberOfCleaners: 0,
                others: 0
            },
            schoolAboutData: {
                vision: '',
                mission: '',
                strategicGoals: '',
                generalOverview: '',
                majorDevelopments: ''
            },
            facilitiesData: [],
            educationalProgramsData: [],
            schoolActivitiesData: [],
            specialNeedsData: [],
            chronicDiseasesData: [],
            multipleDisabilitiesData: [],
            giftedStudentsData: [],
            grade4TestsData: [],
            grade7TestsData: [],
            grade10TestsData: [],
            internationalTestsData: [],
            subjects: [],
            grades: [],
            masteryRates: {},
            gridRowData: [],
            gradesData: [],
            cohortData: [],
            cohortGradeProgresses: [],
            itqanData: [],
            gradesComments: {}
        };
    }

    initializeNotCommingData(editableSchoolInfo: SchoolInfo) {
        if (!editableSchoolInfo.contactInfo) {
            editableSchoolInfo.contactInfo = {
                mainPhone: '',
                fax: '',
                email: '',
                alternatePhone: ''
            };
        }

        if (!editableSchoolInfo.localSchoolSchedule) {
            editableSchoolInfo.localSchoolSchedule = {
                startTime: '',
                endTime: '',
                workingDays: [],
                totalHoursPerWeek: 0
            };
        }

        if (!editableSchoolInfo.additionalInfo) {
            editableSchoolInfo.additionalInfo = {
                schoolVision: '',
                schoolMission: '',
                specialPrograms: '',
                isSpecialNeeds: false,
                totalStudents: 0,
                totalTeachers: 0,
                establishmentHistory: '',
                lastInspectionDate: '',
                accreditationStatus: '',
                schoolStatus: ''
            };
        }

        if (!editableSchoolInfo.privateSchoolInfo) {
            editableSchoolInfo.privateSchoolInfo = {
                ownerName: '',
                ownerNumber: '',
                appliedCurriculum: '',
                internationalProgram: '',
                accreditationBody: '',
                accreditationDate: ''
            };
        }

        if (!Array.isArray(editableSchoolInfo.administrativeStaffData)) {
            editableSchoolInfo.administrativeStaffData = [];
        }

        if (!Array.isArray(editableSchoolInfo.subjectTeachersData)) {
            editableSchoolInfo.subjectTeachersData = [];
        }

        if (!editableSchoolInfo.teachingStaffRatios) {
            editableSchoolInfo.teachingStaffRatios = {
                teacherToStudentRatio: 0,
                teachingEnvironmentProgressRate: 0
            };
        }

        if (!editableSchoolInfo.additionalStaffData) {
            editableSchoolInfo.additionalStaffData = {
                numberOfGuards: 0,
                numberOfCleaners: 0,
                others: 0
            };
        }

        if (!Array.isArray(editableSchoolInfo.educationalProgramsData)) editableSchoolInfo.educationalProgramsData = [];
        if (!Array.isArray(editableSchoolInfo.specialNeedsData)) editableSchoolInfo.specialNeedsData = [];
        if (!Array.isArray(editableSchoolInfo.chronicDiseasesData)) editableSchoolInfo.chronicDiseasesData = [];
        if (!Array.isArray(editableSchoolInfo.multipleDisabilitiesData)) editableSchoolInfo.multipleDisabilitiesData = [];
        if (!Array.isArray(editableSchoolInfo.giftedStudentsData)) editableSchoolInfo.giftedStudentsData = [];
        if (!Array.isArray(editableSchoolInfo.grade4TestsData)) editableSchoolInfo.grade4TestsData = [];
        if (!Array.isArray(editableSchoolInfo.grade7TestsData)) editableSchoolInfo.grade7TestsData = [];
        if (!Array.isArray(editableSchoolInfo.grade10TestsData)) editableSchoolInfo.grade10TestsData = [];
        if (!Array.isArray(editableSchoolInfo.internationalTestsData)) editableSchoolInfo.internationalTestsData = [];
        if (!Array.isArray(editableSchoolInfo.subjects)) editableSchoolInfo.subjects = [];
        if (!Array.isArray(editableSchoolInfo.grades)) editableSchoolInfo.grades = [];

        if (!editableSchoolInfo.masteryRates) editableSchoolInfo.masteryRates = {};
        if (!Array.isArray(editableSchoolInfo.gridRowData)) editableSchoolInfo.gridRowData = [];
        if (!Array.isArray(editableSchoolInfo.cohortData)) editableSchoolInfo.cohortData = [];

        return editableSchoolInfo;
    }



    /**
     * Navigate to performance dashboard with school data from self-evaluation document
     */
    navigateToPerformanceDashboard(): void {
        if (this.selfEvaluationDocument.scheduledSchoolVisit?.school) {
            const schoolBasicInfo = this.schoolDataService.mapSchoolToBasicInfo(
                this.selfEvaluationDocument.scheduledSchoolVisit.school
            );

            // Navigate to performance dashboard with school ID
            const schoolId = schoolBasicInfo.id || this.selfEvaluationDocument.scheduledSchoolVisit.school.id?.toString() || '1';
            this.router.navigate(['/jawda/school-performance/performance-dashboard', schoolId], {
                queryParams: {
                    returnUrl: this.router.url,
                    schoolBasicInfo: JSON.stringify(schoolBasicInfo)
                }
            });
        } else {
            this.toastService.show('No school data available', { classname: 'bg-warning text-white', delay: 3000 });
        }
    }

    private loadData() {
        forkJoin({
            selfEvaluationDocumentSetting: this.selfEvaluationDocumentService.getLatestSettingsForSelfEvaluationDocumentList(),
        }).subscribe({
            next: (res) => {
                this.selfEvaluationDocumentSetting = res.selfEvaluationDocumentSetting.data;
                this.declarationTabInputs.set('selfEvaluationDocumentSetting', this.selfEvaluationDocumentSetting);

                //--- add main object to steps
                this.declarationTabInputs.set('selfEvaluationDocument', this.selfEvaluationDocument);
                this.selfEvaluationDocumentSchoolInfoTabInputs.set('selfEvaluationDocument', this.selfEvaluationDocument);
                this.selfEvaluationDocumentSelfEvalTabInputs.set('selfEvaluationDocument', this.selfEvaluationDocument);
                this.dSelfEvaluationDocumentAttachmentsTabInputs.set('selfEvaluationDocument', this.selfEvaluationDocument);
                this.preparedMainDataObject();

                this.showTabs = true;
            },
            error: err =>
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false })
        });
    }

    getSelfEvaluationDocumentById() {
        this.selfEvaluationDocumentService.getSelfEvaluationDocumentById(this.id).subscribe({
            next: (response) => {
                this.selfEvaluationDocument = response.data;
                if (!this.selfEvaluationDocument.editableSchoolInfo) {
                    this.selfEvaluationDocument.editableSchoolInfo = this.initializeSchoolInfo();
                } else {
                    this.initializeNotCommingData(this.selfEvaluationDocument.editableSchoolInfo);
                }

                this.loadData();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }

    preparedMainDataObject() {
        this.selfEvalMainData = {
            documentNumber: this.selfEvaluationDocument.documentNumber,
            submissionDate: this.selfEvaluationDocument.submissionDate,
            status: this.selfEvaluationDocument.status
        }
    }
}
