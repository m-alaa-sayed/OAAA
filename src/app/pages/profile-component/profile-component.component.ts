import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {forkJoin} from 'rxjs';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {CityDto} from 'src/app/core/models/city-dto';
import {CountryDto} from 'src/app/core/models/country-dto';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {UserProfileService} from 'src/app/core/services/user.service';
import {ExternalReviewerManagementService} from '../external-reviewers/services/external-reviewer-management.service';
import {ExternalReviewer} from '../external-reviewers/types/external-reviewer';
import {UserState} from "../../core/states/user.state";
import {GovernorateDto} from 'src/app/core/models/governorate-dto';
import {WilayatDto} from 'src/app/core/models/wilayat-dto';
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
    selector: 'app-profile-component',
    templateUrl: './profile-component.component.html',
    styleUrl: './profile-component.component.scss'
})
export class ProfileComponentComponent implements OnInit {
    userData: any = {};
    changePasswordObj: any = {};
    @ViewChild("submitForm") submitForm?: NgForm;
    @ViewChild("changePasswordForm") changePasswordForm?: NgForm;
    externalReviewersList: ExternalReviewer[] = [];
    countryList: CountryDto[] = [];
    cityList: CityDto[] = [];
    contactCityList: CityDto[] = [];
    prefixList: SystemLookupDto[] = [];
    genderList: SystemLookupDto[] = [];
    organizationList: SystemLookupDto[] = [];
    originalCountryList: CountryDto[] = [];
    governorateList: GovernorateDto[] = [];
    wilayatList: WilayatDto[] = [];

    currentCountry = {} as CountryDto;

    MOBILE_PATTERN = AppConstants.PATTERNS.MOBILE;
    PHONE_PATTERN = AppConstants.PATTERNS.PHONE;
    oldPasswordField!: boolean;
    confirmField!: boolean;
    newPasswordField!: boolean;
    PASSWORD_PATTERN = AppConstants.PATTERNS.PASSWORD;
    isSubmitting: boolean = false;
    isChangePasswordSubmitting: boolean = false;

    selectedFileName: string | null = null;
    selectedFile: File | null = null;
    userUpdated: boolean = false;


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

    constructor(
        public translate: TranslateService,
        private commonService: CommonService,
        private userProfileService: UserProfileService,
        private toastService: ToastService,
        protected router: Router,
        private externalReviewerManagementService: ExternalReviewerManagementService,
    ) {
    }

    ngOnInit(): void {
        // this.userData = this.TokenStorageService.getUser();
        this.findUser();
        this.getExternalReviewerFiles();
        this.loadAllData();

    }

    getExternalReviewerFiles() {
        this.externalReviewerManagementService.getExternalReviewerFiles().subscribe({
            next: (response) => {
                this.externalReviewersList = response.data.filter(
                    er => er.status !== 'WITHDRAW'
                );
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }

    findUser() {
        this.userProfileService.findUser().subscribe({
            next: (res) => {
                if (res.data) {
                    this.userData = res.data;
                    UserState.setUserState(res.data);
                    this.onOrganizationChange();
                    this.preparedInitValue();
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
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
                this.organizationList = results.organizationList.data;
                this.organizationList = this.organizationList
                    .filter(item => item && item.id !== undefined)
                    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

                this.governorateList = results.governorates.data;
                this.currentCountry = this.countryList.find(c => c.countryCode === '+968') || {};

            }, error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }
    preparedInitValue() {
        const omanId = 1;

        if (this.userData.insideOman) {
            this.userData.phoneNoKeyId = omanId;
            this.userData.mobileNoKeyId = omanId;
            this.userData.countryId = omanId;
            this.userData.cityId = undefined;
            if (this.userData.insideOman && this.userData.governorateId) {
                this.loadWilayatsByGovernorateId(this.userData.governorateId);
            }
        } else {
            this.countryList = this.countryList.filter(c => c.id !== omanId);
            this.loadCitiesByCountryId(this.userData.countryId, false);
        }
        if (this.userData.contactCountryId)
            this.loadCitiesByCountryId(this.userData.contactCountryId, true);
    }

    onGovernorateChange(event: any) {
        const selectedId = +event.target.value;
        this.userData.governorateId = selectedId;
        this.userData.wilayatId = undefined;
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
                    this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'), { classname: 'bg-danger text-white', autohide: false }
                );
            }
        });
    }



    onInsideOmanChange(): void {
        const omanId = 1;

        // Reset cityId
        this.userData.cityId = undefined;

        if (this.userData.insideOman) {
            // restore full list including Oman
            this.countryList = [...this.originalCountryList];

            this.userData.phoneNoKeyId = omanId;
            this.userData.mobileNoKeyId = omanId;
            this.userData.countryId = omanId;

        } else {
            // exclude Oman
            this.countryList = this.originalCountryList.filter(c => c.id !== omanId);

            // if user had Oman selected, clear it
            if (this.userData.countryId === omanId || this.userData.countryId == null) {
                this.userData.countryId = undefined;
            }

            this.cityList = [];
            this.userData.cityId = undefined;
        }
    }


    private loadCitiesByCountryId(countryId: number, isContactCity: boolean): void {
        if (countryId !== undefined) {
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
                            this.userData.contactCityId = this.contactCityList[0].id;
                        } else {
                            this.userData.cityId = this.cityList[0].id;
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
                        this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'), { classname: 'bg-danger text-white', autohide: false }
                    );
                }
            });

        }
    }

    onCountryChange(event: any) {
        const selectedId = +event.target.value;
        this.userData.countryId = selectedId;
        this.userData.cityId = undefined;
        this.loadCitiesByCountryId(selectedId, false);
    }

    onContactCountryChange(event: any) {
        const selectedId = +event.target.value;
        this.userData.contactCountryId = selectedId;
        this.userData.contactCityId = undefined;
        this.loadCitiesByCountryId(selectedId, true);
    }


    submit() {
        this.isSubmitting = true;
        if (this.submitForm?.invalid) {
            scrollTo(0, 0);
            return;
        }
        this.userProfileService.updateProfile(this.userData).subscribe({
            next: (res) => {
                this.userUpdated = true;
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.EDIT_SUCCESS'), {
                    classname: 'bg-success text-white',
                    delay: 3000
                });
                //--- call api /me
                this.findUser();

            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }

    changePassword() {
        this.isChangePasswordSubmitting = true;
        if (this.changePasswordForm?.invalid) {
            scrollTo(0, 0);
            return;
        }
        this.userProfileService.changePassword(this.changePasswordObj).subscribe({
            next: (res) => {
                this.router.navigate(['/auth/success-page'], {
                    state: {
                        message: 'PAGES.COMMON.MESSAGES.PASSWORD_CHANGED_SUCCESS',
                        isLogin: false
                    }
                });
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
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
                    this.userData.passportBucketName = response.data.bucketName;
                    this.userData.passportFileName = response.data.objectName;
                    this.selectedFileName = response.data.objectName;
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false })
                }
            });
    }

    resetFileInput() {
        this.selectedFileName = null;
    }

    cancel() {
        void this.router.navigate([''])
    }

    togglepasswordField() {
        this.oldPasswordField = !this.oldPasswordField;
    }

    toggleNewPasswordField() {
        this.newPasswordField = !this.newPasswordField;
    }

    toggleconfirmField() {
        this.confirmField = !this.confirmField;
    }

    passwordPatternValid(): boolean {
        const regex = new RegExp(this.PASSWORD_PATTERN);
        return regex.test(this.changePasswordObj.newPassword || '');
    }

    passwordsMatch(): boolean {
        return this.changePasswordObj.newPassword === this.changePasswordObj.confirmPassword;
    }



    downloadUploadedFile(objectName?: string, bucketName?: string): void {
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


    onTextChange(): void {
        const result = limitWords(this.userData.address || '', 250);
        this.userData.address = result.trimmedText;
    }


    onOrganizationChange(): void {
        const selectedOrg = this.organizationList.find(
            org => org.id == this.userData.organizationId
        );
        this.isOtherOrganizationSelected = selectedOrg?.lookupValueEn == AppConstants.LOOKUP_CODE.ORGANIZATION_OTHER;
    }
}
