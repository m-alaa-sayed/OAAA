import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServicesUrls } from 'src/app/core/constants/service-urls';
import { CommonService } from 'src/app/core/services/common.service';
import { ServiceManagementService } from 'src/app/core/services/service-management.service';
import { ToastService } from 'src/app/core/services/toast-service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-catalogue-details.component.html',
  styleUrl: './service-catalogue-details.component.scss'
})
export class ServiceCatalogueDetailsComponent {
  serviceId: string | null = '';
  service !: any;

  constructor(private route: ActivatedRoute,
    private serviceManagementService: ServiceManagementService,
    private toastService: ToastService,
    public translate: TranslateService,
    private router: Router,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.findServiceById();
  }

  findServiceById() {
    this.serviceManagementService.retrieveOaaaServiceById(Number(this.serviceId)).subscribe({
      next: (res: any) => {
        this.service = res.data;
        
        // Add test file data for ER Policy (for testing purposes)
        if (this.service && !this.service.erPolicyFileName) {
          this.service.erPolicyFileName = 'ER-Policy-Test-Document.pdf';
          this.service.erPolicyFileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        }
      }, error: err => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  startService() {
    this.validateService();
  }


  validateService() {
    this.commonService.validateService(this.service.serviceCode).subscribe({
      next: (res: any) => {
        const serviceUrlObject = ServicesUrls.find(obj => obj.serviceCode === this.service.serviceCode);
          if (serviceUrlObject) {
            this.router.navigate(['/jawda/external-reviewers/'+ serviceUrlObject.url, this.service.module],
              { state: { serviceCode: this.service.serviceCode } }
            );
          }
        // this.router.navigate(['/jawda/external-reviewers/external-reviewer-registration-service/creation', this.service.module]
        //   ,
        //   { state: { serviceCode: this.service.serviceCode } } );
      }, error: err => {
        this.toastService.show(this.translate.instant('PAGES.EXTERNAL_REVIEWER.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  downloadFile(url: string, filename: string) {
    // Create a temporary anchor element to force download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // Check if this service should show ER Policy fields
  shouldShowErPolicy(): boolean {
    if (!this.service || (!this.service.serviceNameAr && !this.service.serviceNameEn)) {
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

    const serviceNameAr = this.service.serviceNameAr?.trim();
    const serviceNameEn = this.service.serviceNameEn?.trim();

    return externalReviewerServicesAr.includes(serviceNameAr || '') || 
           externalReviewerServicesEn.includes(serviceNameEn || '');
  }

}
