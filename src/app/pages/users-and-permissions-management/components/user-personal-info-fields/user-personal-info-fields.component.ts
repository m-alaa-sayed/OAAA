import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { CityDto } from 'src/app/core/models/city-dto';
import { CountryDto } from 'src/app/core/models/country-dto';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { CommonService } from 'src/app/core/services/common.service';
import { GovernorateDto } from 'src/app/core/models/governorate-dto';
import { WilayatDto } from 'src/app/core/models/wilayat-dto';
import { ToastService } from 'src/app/core/services/toast-service';
import { UserFormPayload } from '../../models/users.model';

@Component({
  selector: 'app-user-personal-info-fields',
  templateUrl: './user-personal-info-fields.component.html',
  styleUrl: './user-personal-info-fields.component.scss'
})
export class AddUserPersonalInfoComponent implements OnInit, OnChanges {

  @Input() user: UserFormPayload = {} as UserFormPayload;
  @Input() userForm!: FormGroup;
  @Input() countryList: CountryDto[] = [];
  @Input() genderList: SystemLookupDto[] = [];
  @Input() governorateList: GovernorateDto[] = [];
  @Input() organizationList: SystemLookupDto[] = [];
  @Input() centerList: any[] = [];
  @Input() isDisabled: boolean = false;
  @Input() showButtons: boolean = true;
  @Input() isEditMode: boolean = false;
  @Input() isSubmitting: boolean = false; // Changed to Input for parent control

  @Output() nextEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() formChanged = new EventEmitter<void>();

  wilayatList: WilayatDto[] = [];
  cityList: CityDto[] = [];

  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  @Input() prefixList: SystemLookupDto[] = [];

  MOBILE_PATTERN = AppConstants.PATTERNS.MOBILE;
  PHONE_PATTERN = AppConstants.PATTERNS.PHONE;

  constructor(
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService,
  ) { }


  ngOnInit(): void {
    this.initializeFromUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue) {
      this.initializeFromUser();
    }

    if (changes['organizationList'] || changes['user']) {
      this.onOrganizationChange();
    }
  }

  private initializeFromUser(): void {
    if (this.user.externalUser === undefined) {
      this.user.externalUser = false;
    }
    this.selectedFileName = this.user.passportFileName || "";
    this.getCurrentCountry();

    // Set residential country to Oman (ID = 1) if inside Oman
    if (this.user.insideOman) {
      this.user.residentialCountryId = 1;
    }

    // Handle wilayat initialization
    if (this.user.wilayat && this.user.wilayatId) {
      // Always ensure the current wilayat is in the list first
      this.wilayatList = [this.user.wilayat];

      // Then load other wilayats from the governorate if available
      const governorateIdToLoad = this.user.governorateId || this.user.wilayat.governorateId;
      if (governorateIdToLoad) {
        this.loadWilayatsByGovernorateId(governorateIdToLoad);
      }
    } else if (this.user.governorateId) {
      // No wilayat but governorate is selected
      this.loadWilayatsByGovernorateId(this.user.governorateId);
    }
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

  onCountryChange(event: any) {
    const selectedId = +event.target.value;

    this.user.cityId = undefined;
    this.cityList = [];

    if (!selectedId || isNaN(selectedId)) return;

    this.commonService.getCitiesByCountryId(selectedId).subscribe({
      next: (res) => {
        this.cityList = res.data || [];

        if (this.cityList.length === 1) {
          this.user.cityId = this.cityList[0].id;
        }
      },
      error: () => {
        this.cityList = [];
      }
    });
  }

  @HostListener('input', ['$event'])
  @HostListener('change', ['$event'])
  onAnyFieldChange(event: Event) {
    this.formChanged.emit();
  }

  onGovernorateChange(selectedId: number | null) {
    if (!selectedId) {
      this.user.wilayatId = undefined;
      this.wilayatList = [];
      return;
    }

    this.user.governorateId = selectedId;
    this.user.wilayatId = undefined;
    this.loadWilayatsByGovernorateId(selectedId);
  }

  loadWilayatsByGovernorateId(governorateId: number) {
    this.commonService.getWilayatByGovernorateId(governorateId).subscribe({
      next: (res) => {
        const loadedWilayats = res.data || [];

        if (this.user.wilayat && this.user.wilayatId) {
          const existsInList = loadedWilayats.some(w => w.id === this.user.wilayatId);
          if (!existsInList) {
            this.wilayatList = [this.user.wilayat, ...loadedWilayats];
          } else {
            this.wilayatList = loadedWilayats;
          }
        } else {
          this.wilayatList = loadedWilayats;
        }
      },
      error: () => {
        // On error, keep user's wilayat if available
        this.wilayatList = this.user.wilayat ? [this.user.wilayat] : [];
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }


  next() {
    this.isSubmitting = true;

    if (!this.user.insideOman && !this.user.passportNo) {
      this.showErrorMessage('PAGES.COMMON.MESSAGES.FIELD_REQUIRED');
      return;
    }

    this.nextEvent.emit();
  }

  private showErrorMessage(message: string) {
    scrollTo(0, 0);
    this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFile();
    }
  }

  isGenderDisabled: boolean = false;

  uploadFile(): void {
    if (!this.selectedFile) {
      console.warn('No file selected');
      return;
    }

    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedFile).subscribe({
      next: (response) => {
        const data = response.data;
        this.user.passportFileName = data.objectName;
        this.user.passportBucketName = data.bucketName;
        this.selectedFileName = data.objectName;
      },
      error: (error) => {
        console.error('Error uploading file:', error);
      }
    });
  }

  onPrefixChange(selectedPrefixId: number) {
    const selectedPrefix = this.prefixList.find(p => p.id === Number(selectedPrefixId));
    if (!selectedPrefix) return;

    const value = selectedPrefix.lookupValueEn;

    if (!value) return;

    if (value.toLowerCase().includes('mr')) {
      const male = this.genderList.find(g =>
        (g.lookupValueEn?.toLowerCase().includes('male'))
      );
      if (male) this.user.genderId = male.id;
      this.isGenderDisabled = true;

    } else if (value.toLowerCase().includes('madam')) {
      const female = this.genderList.find(g =>
        (g.lookupValueEn?.toLowerCase().includes('female'))
      );
      if (female) this.user.genderId = female.id;
      this.isGenderDisabled = true;

    } else {
      this.user.genderId = undefined;
      this.isGenderDisabled = false;
    }
  }

  onOrganizationChange(): void {
    console.log('Organization changed:', this.user.organizationId);
  }

  onInsideOmanChange(): void {
    if (this.user.insideOman) {
      this.user.residentialCountryId = 1;
      // Clear passport related fields when inside Oman
      this.user.passportNo = undefined;
      this.user.passportFileName = undefined;
      this.user.passportBucketName = undefined;
      this.selectedFileName = null;
    } else {
      this.user.residentialCountryId = undefined;
      // workaround to set civil no to 0 when outside oman to avoid validation error
      this.user.civilNo = '0';
    }
  }

  /**
   * Allow only numeric input
   */
  onlyNumbers(event: any): void {
    const input = event.target;
    const value = input.value;
    const filteredValue = value.replace(/[^0-9]/g, '');

    if (value !== filteredValue) {
      input.value = filteredValue;
      // Trigger model update
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  }
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
