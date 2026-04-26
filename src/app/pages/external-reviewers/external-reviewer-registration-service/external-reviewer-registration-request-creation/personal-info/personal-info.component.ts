import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {User} from 'src/app/core/models/auth.models';
import {CityDto} from 'src/app/core/models/city-dto';
import {CountryDto} from 'src/app/core/models/country-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {CommonService} from 'src/app/core/services/common.service';
import {ExternalReviewersRegistrationRequestInfo} from '../../../types/external-reviewers-registration-request-info';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {GovernorateDto} from 'src/app/core/models/governorate-dto';
import {WilayatDto} from 'src/app/core/models/wilayat-dto';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss'
})
export class PersonalInfoComponent implements OnInit {

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() countryList: CountryDto[] = [];
  @Input() prefixList: SystemLookupDto[] = [];
  @Input() genderList: SystemLookupDto[] = [];
  @Input() governorateList: GovernorateDto[] = [];
  @Input() organizationList: SystemLookupDto[] = [];
  @Input() user: User = new User();
  @Input() isDisabled: boolean = true;
  @Input() showButtons: boolean = true;
  @Input() noObjectionCertificateEnable : boolean = true;
  @Input() noObjectionCertificateVisible : boolean = true;

    operationalStatusList = [
        {
        value: 'EMPLOYED',
        labelKey: 'EMPLOYED'
        },
        {
        value: 'RETIRED',
        labelKey: 'RETIRED'
        },
        {
        value: 'RETIRED_PART_TIME',
        labelKey: 'RETIRED_PART_TIME'
        }
    ];

  @Output() nextEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() autoSaveEvent = new EventEmitter<void>();

  originalCountryList: CountryDto[] = [];


  wilayatList: WilayatDto[] = [];

  cityList: CityDto[] = [];
  contactCityList: CityDto[] = [];

  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  selectedNoObjectionCertificateFile: File | null = null;

  isOtherOrganizationSelected: boolean = false;
  isSubmitting: boolean = false;
  PASSWORD_PATTERN = AppConstants.PATTERNS.PASSWORD;
  MOBILE_PATTERN = AppConstants.PATTERNS.MOBILE;
  PHONE_PATTERN = AppConstants.PATTERNS.PHONE;

  constructor(public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService,
  ) { }


  ngOnInit(): void {

    console.log(this.organizationList);
    
    if (this.externalReviewersRegistrationRequestInfo){
      this.externalReviewersRegistrationRequestInfo.insideOman = this.user.insideOman;      
    }


    this.selectedFileName = this.user.passportFileName || "";
    this.getCurrentCountry();

    if (this.user.insideOman && this.user.governorateId) {
      this.loadWilayatsByGovernorateId(this.user.governorateId);
    }
    this.originalCountryList = [... this.countryList];
    this.getContactCityByCountryId();
    this.onOrganizationChange();
  }


  downloadUploadedFile(objectName: any, bucketName: any): void {
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


  getCurrentCountry() {
    const countryId = this.user.city?.countryId;
    if (countryId != null) {
      this.commonService.getCitiesByCountryId(countryId).subscribe({
        next: (res) => {
          this.cityList = res.data || [];
        },
        error: () => {
          this.cityList = [];
        }
      });
    }
  }

  getContactCityByCountryId() {
    const countryId = this.user.contactCountryId;
    if (countryId != null) {
      this.commonService.getCitiesByCountryId(countryId).subscribe({
        next: (res) => {
          this.contactCityList = res.data || [];
        },
        error: () => {
          this.contactCityList = [];
        }
      });
    }
  }

  onCountryChange(event: any) {
    const selectedId = +event.target.value;

    this.user.cityId = undefined;
    this.cityList = [];

    if (!selectedId || isNaN(selectedId)) return;

    this.commonService.getCitiesByCountryId(selectedId).subscribe({
      next: (res) => {
        this.cityList = res.data || [];

        // Optional: auto-select if only one
        if (this.cityList.length === 1) {
          this.user.cityId = this.cityList[0].id;
        }
      },
      error: () => {
        this.cityList = [];
      }
    });
  }

  onContactCountryChange(event: any) {
    const selectedId = +event.target.value;

    this.user.contactCityId = undefined;
    this.contactCityList = [];

    if (!selectedId || isNaN(selectedId)) return;

    this.commonService.getCitiesByCountryId(selectedId).subscribe({
      next: (res) => {
        this.contactCityList = res.data || [];

        // Optional: auto-select if only one
        if (this.contactCityList.length === 1) {
          this.user.contactCityId = this.contactCityList[0].id;
        }
      },
      error: () => {
        this.contactCityList = [];
      }
    });
  }


  onGovernorateChange(event: any) {
    const selectedId = +event.target.value;
    this.user.governorateId = selectedId;
    this.user.wilayatId = undefined;
    this.loadWilayatsByGovernorateId(selectedId);
  }




  loadWilayatsByGovernorateId(governorateId: number) {
    this.commonService.getWilayatByGovernorateId(governorateId).subscribe({
      next: (res) => {
        this.wilayatList = res.data || [];
      },
      error: () => {
        this.wilayatList = [];
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  
  next() {
    this.isSubmitting = true;
    if (this.externalReviewersRegistrationRequestInfo.module == 'CHEQA' &&
       this.user.headOfBusiness &&
       this.noObjectionCertificateVisible &&
      (!this.externalReviewersRegistrationRequestInfo.noObjectionCertificateFileName)) {
      this.showErrorMessage('PAGES.EXTERNAL_REVIEWER.MESSAGES.NO_OBJECTION_CERTIFICATE_REQUIRED_MESSAGE');
      return;
    }

     if (!this.user.insideOman) {
      this.externalReviewersRegistrationRequestInfo.passportNo = this.user.passportNo;
      this.externalReviewersRegistrationRequestInfo.passportBucketName = this.user.passportBucketName;
      this.externalReviewersRegistrationRequestInfo.passportFileName = this.user.passportFileName;
    }

    this.nextEvent.emit()
  }

  private showErrorMessage(message: string) {
    scrollTo(0, 0);
    this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
  }

  // passport file 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      //this.uploadFile();
    }
  }

  onCertificateSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedNoObjectionCertificateFile = file;
      this.uploadFile();
    }
  }

    uploadFile(): void {
    if (!this.selectedNoObjectionCertificateFile) {
      console.warn('No file selected for', this.selectedNoObjectionCertificateFile);
      return;
    }

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedNoObjectionCertificateFile).subscribe({
      next: (response) => {
        const data = response.data;
        this.externalReviewersRegistrationRequestInfo.noObjectionCertificateFileName = data.objectName;
        this.externalReviewersRegistrationRequestInfo.noObjectionCertificateBucketName = data.bucketName;

      },
      error: (error) => {
        console.error(`Error uploading file for ${this.selectedNoObjectionCertificateFile}:`, error);
      }
    });
  }



  onTextChange(): void {
    const result = limitWords(this.user.streetAddress || '', 250);
    this.user.streetAddress = result.trimmedText;
  }


  onOrganizationChange(): void {
    const selectedOrg = this.organizationList.find(
      org => org.id == this.user.organizationId
    );
    this.isOtherOrganizationSelected = selectedOrg?.lookupValueEn == AppConstants.LOOKUP_CODE.ORGANIZATION_OTHER;
  }
}
