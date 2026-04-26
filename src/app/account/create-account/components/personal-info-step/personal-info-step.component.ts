import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { RegistrationCompletionRequestDto } from 'src/app/account/model/registration-completion-request-dto';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { CityDto } from 'src/app/core/models/city-dto';
import { CountryDto } from 'src/app/core/models/country-dto';
import { GovernorateDto } from 'src/app/core/models/governorate-dto';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { WilayatDto } from 'src/app/core/models/wilayat-dto';
import { CommonService } from 'src/app/core/services/common.service';
import { CreateAccountWizardService } from 'src/app/core/services/create-account-wizard.service';
import { CreateAccountService } from 'src/app/core/services/create-account.service';
import { FileService } from 'src/app/core/services/file.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { limitWords } from 'src/app/shared/utils/word-utils';
import { BaseStepComponent } from 'src/app/shared/wizard-template/base-step.component';

@Component({
  selector: 'app-personal-info-step',
  templateUrl: './personal-info-step.component.html',
  styleUrl: './personal-info-step.component.scss'
})
export class PersonalInfoStepComponent extends BaseStepComponent implements OnInit {

  @Input() registrationCompletionRequestDto !: RegistrationCompletionRequestDto;

  @ViewChild("submitForm") submitForm?: NgForm;
  isGenderDisabled: boolean = false;

  countryList: CountryDto[] = [];
  cityList: CityDto[] = [];
  contactCityList: CityDto[] = [];
  prefixList: SystemLookupDto[] = [];
  genderList: SystemLookupDto[] = [];
  organizationList: SystemLookupDto[] = [];

  governorateList: GovernorateDto[] = [];
  wilayatList: WilayatDto[] = [];
  originalCountryList: CountryDto[] = [];


  currentCountry = {} as CountryDto;

  passwordField!: boolean;
  confirmField!: boolean;
  PASSWORD_PATTERN = AppConstants.PATTERNS.PASSWORD;
  MOBILE_PATTERN = AppConstants.PATTERNS.MOBILE;
  PHONE_PATTERN = AppConstants.PATTERNS.PHONE;
  isSubmitting: boolean = false;

  selectedFileName: string | null = null;
  selectedFile: File | null = null;

  userAdded: boolean = false;
  isOtherOrganizationSelected: boolean = false;

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

  constructor(public createAccountWizardService: CreateAccountWizardService,
    protected override router: Router,
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService,
    private fileService: FileService,
    private createAccountService: CreateAccountService
  ) {
    super(createAccountWizardService, router);
  }


  ngOnInit(): void {
    this.registrationCompletionRequestDto.insideOman = true;
    this.loadAllData();
  }


  loadAllData() {
    forkJoin({
      countryList: this.commonService.getAllCountries(),
      prefixList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.TITLE),
      genderList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.GENDER),
      organizationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ORGANIZATION),
      governorates: this.commonService.getAllGovernorates(),
    }).subscribe({
      next: (results) => {
        this.originalCountryList = results.countryList.data;
        this.countryList = [...this.originalCountryList];
        this.prefixList = results.prefixList.data;
        this.genderList = results.genderList.data;
        this.governorateList = results.governorates.data;
        this.organizationList = results.organizationList.data;
        this.organizationList = this.organizationList
          .filter(item => item && item.id !== undefined)
          .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        this.currentCountry = this.countryList.find(c => c.countryCode === '+968') || {};
        this.preparedInitValue();

      }, error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  private preparedInitValue() {
    const omanId = 1;
    this.registrationCompletionRequestDto.phoneNoKeyId = omanId;
    this.registrationCompletionRequestDto.mobileNoKeyId = omanId;

    if (this.registrationCompletionRequestDto.insideOman) {
      this.registrationCompletionRequestDto.countryId = omanId;
      this.registrationCompletionRequestDto.cityId = undefined;
      if (this.registrationCompletionRequestDto.governorateId) {
        this.loadWilayatsByGovernorateId(this.registrationCompletionRequestDto.governorateId);
      }
    } else {
      this.countryList = this.originalCountryList.filter(c => c.id !== omanId);
      if (this.registrationCompletionRequestDto.countryId)
        this.loadCitiesByCountryId(this.registrationCompletionRequestDto.countryId, false);

    }
    if (this.registrationCompletionRequestDto.contactCountryId)
      this.loadCitiesByCountryId(this.registrationCompletionRequestDto.contactCountryId, true);
  }

  onInsideOmanChange() {
    const omanId = 1;
    this.registrationCompletionRequestDto.cityId = undefined;
    this.registrationCompletionRequestDto.governorateId = undefined;
    this.registrationCompletionRequestDto.wilayatId = undefined;

    if (this.registrationCompletionRequestDto.insideOman) {
      this.countryList = [...this.originalCountryList];
      this.registrationCompletionRequestDto.countryId = omanId;
    } else {
      this.countryList = this.originalCountryList.filter(c => c.id !== omanId);
      if (this.registrationCompletionRequestDto.countryId === omanId || !this.registrationCompletionRequestDto.countryId)
        this.registrationCompletionRequestDto.countryId = undefined;
    }

    this.cityList = [];
    this.registrationCompletionRequestDto.cityId = undefined;
  }

  onGovernorateChange(event: any) {
    const selectedId = +event.id;
    this.registrationCompletionRequestDto.governorateId = selectedId;
    this.registrationCompletionRequestDto.wilayatId = undefined;
    this.loadWilayatsByGovernorateId(selectedId);
  }

  loadWilayatsByGovernorateId(governorateId: number) {
    this.commonService.getWilayatByGovernorateId(governorateId).subscribe({
      next: (res) => {
        this.wilayatList = res.data || [];
      },
      error: () => {
        this.wilayatList = [];
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'), {
          classname: 'bg-danger text-white', autohide: false
        });
      },
    });
  }


  private loadCitiesByCountryId(countryId: number, isContactCity: boolean): void {
    this.commonService.getCitiesByCountryId(countryId).subscribe({
      next: (res) => {

        const cities = res.data || [];

        if (isContactCity) {
          this.contactCityList = cities;
        } else {
          this.cityList = cities;
        }
        // Optional: auto-select first city if only one or prefill in edit
        if (cities.length === 1) {
          if (isContactCity) {
            this.registrationCompletionRequestDto.contactCityId = this.contactCityList[0].id;
          } else {
            this.registrationCompletionRequestDto.cityId = this.cityList[0].id;
          }
        }


      },
      error: () => {
        if (isContactCity) {
          this.contactCityList = [];
        } else {
          this.cityList = [];
        }
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }


  onCountryChange(event: any) {
    const selectedId = +event.id;
    this.registrationCompletionRequestDto.countryId = selectedId;
    this.registrationCompletionRequestDto.cityId = undefined;
    this.loadCitiesByCountryId(selectedId, false);
  }

  onContactCountryChange(event: any) {
    const selectedId = +event.id;
    this.registrationCompletionRequestDto.contactCountryId = selectedId;
    this.registrationCompletionRequestDto.contactCityId = undefined;
    this.loadCitiesByCountryId(selectedId, true);
  }


  togglepasswordField() {
    this.passwordField = !this.passwordField;
  }

  toggleconfirmField() {
    this.confirmField = !this.confirmField;
  }

  passwordPatternValid(): boolean {
    const regex = new RegExp(this.PASSWORD_PATTERN);
    return regex.test(this.registrationCompletionRequestDto.password || '');
  }

  passwordsMatch(): boolean {
    return this.registrationCompletionRequestDto.password === this.registrationCompletionRequestDto.confirmPassword;
  }

  submit() {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      scrollTo(0, 0);
      return;
    }
    this.registrationCompletionRequestDto.username = this.registrationCompletionRequestDto.email;
    this.createAccountService.completeRegistration(this.registrationCompletionRequestDto).subscribe({
      next: (res) => {
        this.userAdded = true;
        this.router.navigate(['/auth/success-page'], {
          state: { message: 'PAGES.COMMON.MESSAGES.ACCOUNT_CREATED_WITH_ACCESS' }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  //--- upload download file functions
  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.uploadFile();
    }
    event.target.value = null;
    // const file = event.target.files[0];
    // if (file) {
    //   this.selectedFile = file;
    //   this.uploadFile();
    // }
  }


  uploadFile(): void {
    if (!this.selectedFile) {
      console.warn('No file selected');
      return;
    }
    this.commonService.uploadOaaaFile(AppConstants.FILE_UPLOAD_DOWNLOAD.BUCKET,
      this.selectedFile, this.registrationCompletionRequestDto.email
    ).subscribe({
      next: (response) => {
        this.registrationCompletionRequestDto.passportBucketName = response.data.bucketName;
        this.registrationCompletionRequestDto.passportFileName = response.data.objectName;
        console.log('File uploaded successfully:', response.data);
      },
      error: (error) => {
        this.selectedFile = null;
        this.selectedFileName = null;
        console.error('Upload error:', error)
      }
    });
  }

  resetFileInput() {
    this.selectedFileName = null;
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
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
      if (male) this.registrationCompletionRequestDto.genderId = male.id;
      this.isGenderDisabled = true;

    } else if (value.toLowerCase().includes('madam')) {
      const female = this.genderList.find(g =>
        (g.lookupValueEn?.toLowerCase().includes('female'))
      );
      if (female) this.registrationCompletionRequestDto.genderId = female.id;
      this.isGenderDisabled = true;

    } else {
      this.registrationCompletionRequestDto.genderId = undefined;
      this.isGenderDisabled = false;
    }
  }

  onTextChange(): void {
    const result = limitWords(this.registrationCompletionRequestDto.streetAddress || '', 250);
    this.registrationCompletionRequestDto.streetAddress = result.trimmedText;
  }


  onOrganizationChange(): void {
    const selectedOrg = this.organizationList.find(
      org => org.id == this.registrationCompletionRequestDto.organizationId
    );
    this.isOtherOrganizationSelected = selectedOrg?.lookupValueEn == AppConstants.LOOKUP_CODE.ORGANIZATION_OTHER;
  }

}


