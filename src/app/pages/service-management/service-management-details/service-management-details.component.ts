import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceManagementService } from 'src/app/core/services/service-management.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { TranslateService } from '@ngx-translate/core';
import { OaaaServiceCategoryService } from 'src/app/core/services/oaaa.service.category.service';
import { OaaaServiceCategorySearchDto } from 'src/app/core/models/oaaa.service.category.search.dto';
import { OaaaServiceCategoryDto } from 'src/app/core/models/oaaa.service.category.dto';
import { BaseModal } from 'src/app/shared/base-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { OaaaServiceDto } from "../types/oaaa-service-dto";
import { CommonService } from "../../../core/services/common.service";
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'service-management-details',
  templateUrl: './service-management-details.component.html',
  styleUrl: './service-management-details.component.scss'
})
export class ServiceManagementDetailsComponent extends BaseModal implements OnInit {

  id: string | null = '';
  isEdit: boolean = false;
  oaaaServiceDto = {} as OaaaServiceDto;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  // ER Policy file state
  selectedErPolicyFileEn: File | null = null;
  selectedErPolicyFileAr: File | null = null;
  selectedErPolicyFileNameEn: string | null = null;
  selectedErPolicyFileNameAr: string | null = null;
  categoryList: OaaaServiceCategoryDto[] = [];
  isSubmitting: boolean = false;

  @ViewChild("submitForm") submitForm?: NgForm;

  constructor(private route: ActivatedRoute,
    public override modalService: NgbModal,
    private serviceManagementService: ServiceManagementService,
    private toastService: ToastService,
    public translate: TranslateService,
    public commonService: CommonService,
    private oaaaServiceCategory: OaaaServiceCategoryService,
    private router: Router
  ) {
    super(modalService);
  }

  ngOnInit(): void {
    // Get route parameter 'id'
    this.id = this.route.snapshot.paramMap.get('id');
    // Get query parameter 'mode'
    this.route.queryParams.subscribe(params => {
      this.isEdit = params['mode'] == 'edit';
    });
    this.getCategoryList();
    this.retrieveOaaaServiceById();

  }

  resetFileInput() {
    this.selectedFileName = null;
  }

  getCategoryList() {
    const oaaaServiceCategorySearchDto = {} as OaaaServiceCategorySearchDto;
    oaaaServiceCategorySearchDto.displayStatusList = [true];
    this.oaaaServiceCategory.search(oaaaServiceCategorySearchDto).subscribe({
      next: data => {
        this.categoryList = data;
      },
      error: error => {
      }
    });
  }

  retrieveOaaaServiceById() {
    this.serviceManagementService.retrieveOaaaServiceById(Number(this.id)).subscribe({
      next: (res) => {
        if (res.data) {
          this.oaaaServiceDto = res.data;
          if (this.oaaaServiceDto.userManualFileObjectName) {
            this.selectedFileName = this.oaaaServiceDto.userManualFileObjectName;
          }
          if (this.oaaaServiceDto.externalReviewerPolicyEnglishFileName || this.oaaaServiceDto.externalReviewerPolicyArabicFileName) {
            this.selectedErPolicyFileNameEn = this.oaaaServiceDto.externalReviewerPolicyEnglishFileName || null;
            this.selectedErPolicyFileNameAr = this.oaaaServiceDto.externalReviewerPolicyArabicFileName || null;
          }
        }
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  validateForm(content: any) {
    this.isSubmitting = true;
    // ER Policy files are mandatory only for external reviewer services
    const shouldHaveErPolicy = this.shouldShowErPolicy();
    const erPolicyMissing = shouldHaveErPolicy && (!this.oaaaServiceDto.externalReviewerPolicyEnglishFileName || !this.oaaaServiceDto.externalReviewerPolicyArabicFileName);

    if (this.submitForm?.invalid ||
      (!this.oaaaServiceDto.userManualFileObjectName && this.oaaaServiceDto.showUserManual) ||
      erPolicyMissing) {
      scrollTo(0, 0);
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), { classname: 'bg-danger text-white', autohide: false });
      return;
    }

    this.open(content);
  }

  saveService() {
    console.log(this.oaaaServiceDto);
    this.close();
    this.serviceManagementService.editService(Number(this.oaaaServiceDto.id), this.oaaaServiceDto)
      .subscribe({
        next: () => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.EDIT_SUCCESS'), { classname: 'bg-success text-white', delay: 3000 });
          this.router.navigate(['/jawda/service-management/service-management-list']);
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
        },
        complete: () => {
          //this.isLoading = false;
        }
      });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFile();
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      console.warn('No file selected');
      return;
    }

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedFile)
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.oaaaServiceDto.userManualFileBucketName = data.bucketName;
          this.oaaaServiceDto.userManualFileObjectName = data.objectName;
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
            classname: 'bg-danger text-white',
              autohide: false
          })
        }
      });
  }

  // ER Policy EN: file select + upload
  onErPolicyFileSelectedEn(event: any): void {
    const file = event.target.files[0];
    console.log(file);
    
    if (file) {
      this.selectedErPolicyFileEn = file;
      this.uploadErPolicyFileEn();
    }
  }

  uploadErPolicyFileEn(): void {
    if (!this.selectedErPolicyFileEn) {
      console.warn('No ER Policy EN file selected');
      return;
    }

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedErPolicyFileEn)
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.oaaaServiceDto.externalReviewerPolicyEnglishBucketName = data.bucketName;
          this.oaaaServiceDto.externalReviewerPolicyEnglishFileName = data.objectName;
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
            classname: 'bg-danger text-white',
              autohide: false
          })
        }
      });
  }

  // ER Policy AR: file select + upload
  onErPolicyFileSelectedAr(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedErPolicyFileAr = file;
      this.uploadErPolicyFileAr();
    }
  }

  uploadErPolicyFileAr(): void {
    if (!this.selectedErPolicyFileAr) {
      console.warn('No ER Policy AR file selected');
      return;
    }

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedErPolicyFileAr)
      .subscribe({
        next: (response) => {
          const data = response.data;
          this.oaaaServiceDto.externalReviewerPolicyArabicBucketName = data.bucketName;
          this.oaaaServiceDto.externalReviewerPolicyArabicFileName = data.objectName;
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
            classname: 'bg-danger text-white',
              autohide: false
          })
        }
      });
  }


  downloadUploadedFile(objectName: string, bucketName: string): void {
    if (!objectName || !bucketName) {
      console.warn('Missing file data');
      return;
    }

    this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
      .subscribe({
        next: (res) => {
          const downloadUrl = res.data;

          fetch(downloadUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('File download failed.');
              }
              return response.blob();
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = objectName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            })
            .catch(err => {
              console.error('Download via blob failed:', err);
            });
        },
        error: (err) => {
          console.error('Download failed:', err);
        }
      });
  }

  addDocument() {
    this.oaaaServiceDto.oaaaServiceRequiredDocuments.push({
      documentNameAr: '',
      documentNameEn: ''
    });
  }

  deleteDocument(index: number) {
    this.oaaaServiceDto.oaaaServiceRequiredDocuments.splice(index, 1);
  }

  addCondition() {
    this.oaaaServiceDto.oaaaServiceConditions.push({
      conditionNameAr: '',
      conditionNameEn: ''
    });
  }

  deleteCondition(index: number) {
    this.oaaaServiceDto.oaaaServiceConditions.splice(index, 1);
  }


  onTextChange(obj: any, field: string, value: string): void {
    const result = limitWords(value || '', 250);
    obj[field] = result.trimmedText;
  }

  // Check if this service should show ER Policy fields
  shouldShowErPolicy(): boolean {
    if (!this.oaaaServiceDto || (!this.oaaaServiceDto.serviceNameAr && !this.oaaaServiceDto.serviceNameEn)) {
      return false;
    }

    const externalReviewerServicesAr = [
      'تسجيل المراجع الخارجي - مركز ضمان جودة التعليم العالى',
      'طلب الانسحاب كمراجع خارجى من مركز ضمان جودة التعليم العالى',
      'إعادة الانضمام كمراجع خارجى - مركز ضمان جودة التعليم العالى',
      'تسجيل المراجع الخارجي - مركز ضمان جودة التعليم المدرسى',
      'طلب الانسحاب كمراجع خارجى من مركز ضمان جودة التعليم المدرسى',
      'إعادة الانضمام كمراجع خارجى - مركز ضمان جودة التعليم المدرسى',
      'تسجيل المراجع الخارجي - الإطار الوطنى للمؤهلات',
      'طلب الانسحاب كمراجع خارجى من الإطار الوطنى للمؤهلات',
      'إعادة الانضمام كمراجع خارجى - الإطار الوطنى للمؤهلات'
    ];

    const externalReviewerServicesEn = [
      'External Reviewer Registration - Higher Education Quality Assurance Centre',
      'Withdrawal Request as External Reviewer from Higher Education Quality Assurance Centre',
      'Re-joining as External Reviewer - Higher Education Quality Assurance Centre',
      'External Reviewer Registration - School Education Quality Assurance Centre',
      'Withdrawal Request as External Reviewer from School Education Quality Assurance Centre',
      'Re-joining as External Reviewer - School Education Quality Assurance Centre',
      'External Reviewer Registration - National Qualifications Framework',
      'Withdrawal Request as External Reviewer from National Qualifications Framework',
      'Re-joining as External Reviewer - National Qualifications Framework'
    ];

    const serviceNameAr = this.oaaaServiceDto.serviceNameAr?.trim();
    const serviceNameEn = this.oaaaServiceDto.serviceNameEn?.trim();

    return externalReviewerServicesAr.includes(serviceNameAr || '') || 
           externalReviewerServicesEn.includes(serviceNameEn || '');
  }

}
