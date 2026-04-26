import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { CountryDto } from 'src/app/core/models/country-dto';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { GovernorateDto } from 'src/app/core/models/governorate-dto';
import { CommonService } from 'src/app/core/services/common.service';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { ToastService } from 'src/app/core/services/toast-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { AddUserPayload, UserFormPayload } from '../../models/users.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements OnInit {

    emailForm!: FormGroup;
    userForm!: FormGroup;
    breadCrumbItems!: Array<{}>;

    // User data for personal info component
    user: UserFormPayload = {} as UserFormPayload;
    countryList: CountryDto[] = [];
    genderList: SystemLookupDto[] = [];
    prefixList: SystemLookupDto[] = [];
    governorateList: GovernorateDto[] = [];
    organizationList: SystemLookupDto[] = [];
    centerList: any[] = [];

    // Notification settings (separate from user form)
    receiveSms: boolean = true;
    receiveEmails: boolean = true;

    // UI state
    usernameExists: boolean = false;
    isSubmitting: boolean = false;
    showValidationErrors: boolean = false; // For showing red borders on invalid fields
    isDisabled: boolean = false;
    isCheckingEmail: boolean = false;
    returnTab: number = 1; // Default to users tab

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public translate: TranslateService,
        private commonService: CommonService,
        private toastService: ToastService,
        private fb: FormBuilder,
        private usersManagementService: UsersManagementService,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.breadCrumbItems = [
            { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USERS_AND_PERMISSIONS_MANAGEMENT'), link: '/jawda/users-permissions-management' },
            { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.ADD_USER'), active: true }
        ];

        // Read returnTab query param
        this.route.queryParams.subscribe(params => {
            if (params['returnTab']) {
                this.returnTab = +params['returnTab'];
            }
        });

        this.emailForm = this.fb.group({
            email: [''],
            username: ['', [
                Validators.required, 
                Validators.minLength(3),
                this.noArabicValidator(),
                this.noSpacesValidator()
            ]]
        });

        this.initializeUserForm();
        this.loadLookups();
    }

    initializeUserForm(): void {
        this.userForm = this.fb.group({
            // English name fields - all required
            firstNameEn: ['', Validators.required],
            secondNameEn: ['', Validators.required],
            thirdNameEn: ['', Validators.required],
            lastNameEn: ['', Validators.required],
            // Arabic name fields - all required
            firstNameAr: ['', Validators.required],
            secondNameAr: ['', Validators.required],
            thirdNameAr: ['', Validators.required],
            lastNameAr: ['', Validators.required],
            // Full names
            fullNameAr: [''],
            fullNameEn: [''],
            // Identification - conditional (civil required by default for inside Oman)
            civilNo: ['', Validators.required],
            passportNo: [''],
            insideOman: [true],
            // Contact - mobile is required with pattern validation
            mobileNo: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{7,14}$/)]],
            phoneNo: ['', Validators.pattern(/^\+?[1-9]\d{1,14}$/)],
            mobileNoKeyId: ['', Validators.required],
            phoneNoKeyId: [''],
            // Personal data - optional
            genderId: [''],
            nationalityId: [''],
            birthDate: [''],
            // Location - required (governorate/wilayat by default for inside Oman)
            residentialCountryId: ['', Validators.required],
            governorateId: [''],
            wilayatId: [''],
            cityId: [''],
            // Professional - optional
            jobTitle: [''],
            organizationId: [''],
            centerId: [''],
            operationalStatus: [''],
            // Other
            title: [''],
            prefixId: [''],
            passportBucketName: ['',],
            passportFileName: ['']
        });

        // Set default insideOman value to user object
        this.user.insideOman = true;
        this.user.residentialCountryId = 1; // Default to Oman

        // Add conditional validators for insideOman (civil/passport and location fields)
        this.userForm.get('insideOman')?.valueChanges.subscribe(insideOman => {
            if (insideOman) {
                // Inside Oman: require civil number, governorate, wilayat
                this.userForm.get('civilNo')?.setValidators([Validators.required]);
                this.userForm.get('passportNo')?.clearValidators();
                this.userForm.get('passportFileName')?.clearValidators();
                this.userForm.get('governorateId')?.clearValidators();
                this.userForm.get('wilayatId')?.clearValidators();
                this.userForm.get('cityId')?.clearValidators();
                // Set residential country to Oman when inside Oman
                this.user.residentialCountryId = 1;
                this.userForm.patchValue({ residentialCountryId: 1 }, { emitEvent: false });
            } else {
                // Outside Oman: require passport and city
                this.userForm.get('passportNo')?.setValidators([Validators.required]);
                this.userForm.get('passportFileName')?.clearValidators();
                this.userForm.get('civilNo')?.clearValidators();
                this.userForm.get('cityId')?.clearValidators();
                this.userForm.get('governorateId')?.clearValidators();
                this.userForm.get('wilayatId')?.clearValidators();
                // Clear residential country when outside Oman
                this.user.residentialCountryId = undefined;
                this.userForm.patchValue({ residentialCountryId: undefined }, { emitEvent: false });
            }
            // Update validity for all affected fields
            this.userForm.get('civilNo')?.updateValueAndValidity();
            this.userForm.get('passportNo')?.updateValueAndValidity();
            this.userForm.get('passportFileName')?.updateValueAndValidity();
            this.userForm.get('governorateId')?.updateValueAndValidity();
            this.userForm.get('wilayatId')?.updateValueAndValidity();
            this.userForm.get('cityId')?.updateValueAndValidity();
        });

        // Sync form changes with user object for the template-driven child component
        this.userForm.valueChanges.subscribe(values => {
            Object.assign(this.user, values);

            // Handle conditional validators for organizationId/centerId based on externalUser
            const externalUser = values.externalUser;
            if (externalUser) {
                this.userForm.get('organizationId')?.clearValidators();
                this.userForm.get('centerId')?.clearValidators();
            } else {
                // Authority employee: center is required
                this.userForm.get('centerId')?.setValidators([Validators.required]);
                this.userForm.get('organizationId')?.clearValidators();
            }
            this.userForm.get('organizationId')?.updateValueAndValidity({ emitEvent: false });
            this.userForm.get('centerId')?.updateValueAndValidity({ emitEvent: false });
        });
    }

    loadLookups(): void {
        forkJoin({
            countryList: this.commonService.getAllCountries(),
            genderList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.GENDER),
            organizationList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.ORGANIZATION),
            governorates: this.commonService.getAllGovernorates(),
            centerList: this.usersManagementService.getGroupsBasicInfo(),
            prefixList: this.commonService.getByLookupCode(AppConstants.LOOKUP_CODE.TITLE)
        }).subscribe({
            next: (res) => {
                this.countryList = res.countryList.data || [];
                this.genderList = res.genderList.data || [];
                this.organizationList = res.organizationList.data || [];
                this.governorateList = res.governorates.data || [];
                this.centerList = res.centerList || [];
                this.prefixList = res.prefixList.data || [];

                // Set default gender to Male
                const maleGender = this.genderList.find(g => g.lookupValueEn === 'Male');
                if (maleGender && !this.user.genderId) {
                    this.user.genderId = maleGender.id;
                    this.userForm.patchValue({ genderId: maleGender.id }, { emitEvent: false });
                }
            },
            error: (err) => {
                console.error('Error loading lookups:', err);
                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
                    { classname: 'bg-danger text-white', autohide: false }
                );
            }
        });
    }

    checkUsername(): void {
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            return;
        }

        const username = this.emailForm.get('username')?.value;
        this.isCheckingEmail = true;

        // Check if username is in email format and set email value
        if (this.isEmailFormat(username)) {
            this.emailForm.get('email')?.setValue(username);
        }

        this.usersManagementService.validateEmail(username).subscribe({
            next: (response) => {
                this.isCheckingEmail = false;
                this.usernameExists = true;
                this.user.email = this.emailForm.get('email')?.value || username;
                this.user.username = username;

                // Add validation to email field when it becomes visible
                this.emailForm.get('email')?.setValidators([Validators.required, Validators.email]);
                this.emailForm.get('email')?.updateValueAndValidity();

                // Disable fields to prevent editing
                this.emailForm.get('username')?.disable();

                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.EMAIL_VERIFIED'),
                    { classname: 'bg-success text-white', autohide: true, delay: 3000 }
                );
            },
            error: (error) => {
                this.isCheckingEmail = false;
                this.usernameExists = false;
                console.log('lolll: ', error);
                

                this.toastService.show(
                    error.error?.message || this.translate.instant(`PAGES.COMMON.MESSAGES.${error}`),
                    { classname: 'bg-danger text-white', autohide: false }
                );
            }
        });
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isEmailFormat(value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    goBack(): void {
        this.router.navigate(['/jawda/users-permissions-management'], {
            queryParams: { returnTab: this.returnTab }
        });
    }



    save(): void {
        this.submitUser();
    }

    reload(): void {
        const title = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.RELOAD_USER_DATA_CONFIRMATION_TITLE');
        const message = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.RELOAD_USER_DATA_CONFIRMATION_MESSAGE');

        ModalConfirmComponent.openConfirm(this.modalService, message, title).then((confirmed) => {
            if (confirmed) {
                // Clear forms so user can enter a new username/email
                this.emailForm.reset();
                this.emailForm.enable(); // Ensure fields are enabled for re-entry

                // Explicitly clear controls and update state
                this.emailForm.get('username')?.setValue('');
                this.emailForm.get('email')?.setValue('');
                // Remove any validators that were added to email during previous verification
                this.emailForm.get('email')?.clearValidators();
                this.emailForm.get('username')?.markAsPristine();
                this.emailForm.get('username')?.markAsUntouched();
                this.emailForm.get('username')?.updateValueAndValidity();
                this.emailForm.get('email')?.updateValueAndValidity();

                this.userForm.reset({
                    insideOman: true,
                    operationalStatus: '',
                    prefixId: ''
                });

                // Reset state
                this.user = { insideOman: true } as UserFormPayload;
                this.receiveSms = false;
                this.receiveEmails = false;
                this.usernameExists = false;
                this.isCheckingEmail = false;
                this.isSubmitting = false;
                this.showValidationErrors = false;
                this.isDisabled = false;
            }
        });

    }


    private submitUser(): void {
        // Check email form validation first
        if (this.emailForm.invalid) {
            this.emailForm.markAllAsTouched();
            this.showError('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING');
            return;
        }

        // Sync user object to form for validation
        this.userForm.patchValue(this.user, { emitEvent: false });

        // Additional validation for passport when outside Oman
        if (!this.user.insideOman && (!this.user.passportNo || this.user.passportNo.trim() === '')) {
            this.userForm.markAllAsTouched();
            this.showValidationErrors = true;
            this.showError('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING');
            return;
        }

        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            this.showValidationErrors = true; // Show red borders without spinner
            this.showError('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING');
            return;
        }

        const message = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.CREATE_USER_CONFIRMATION_MESSAGE');
        const title = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.CREATE_USER');
        const notesLabel: string = this.translate.instant('PAGES.COMMON.LABELS.NOTES'); // Label for notes field

        ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true, notesLabel).then((result) => {
            if (result.confirmed) {
                this.isSubmitting = true; // Show spinner only when actually submitting
                this.performSubmit(result.notes);
            }
        });
    }

    private performSubmit(notes: string): void {

        const formValue = this.userForm.value;

        // Get the selected center/group code
        const selectedCenter = this.centerList.find(center => center.id == formValue.centerId);
        const groupCode = selectedCenter?.code;

        // Map UserFormPayload to AddUserPayload for API
        const payload: any = {
            data: {
                email: this.emailForm.get('email')?.value,
                username: this.emailForm.get('username')?.value,
                firstNameEn: formValue.firstNameEn,
                secondNameEn: formValue.secondNameEn,
                thirdNameEn: formValue.thirdNameEn,
                lastNameEn: formValue.lastNameEn,
                firstNameAr: formValue.firstNameAr,
                secondNameAr: formValue.secondNameAr,
                thirdNameAr: formValue.thirdNameAr,
                lastNameAr: formValue.lastNameAr,
                civilNo: formValue.civilNo,
                insideOman: formValue.insideOman,
                mobileNo: formValue.mobileNo,
                phoneNo: formValue.phoneNo,
                mobileNoKeyId: formValue.mobileNoKeyId,
                phoneNoKeyId: formValue.phoneNoKeyId,
                genderId: formValue.genderId,
                nationalityId: formValue.nationalityId,
                countryId: formValue.residentialCountryId,
                // cityId only for outside Oman, undefined for inside Oman
                cityId: !formValue.insideOman ? formValue.cityId : undefined,
                birthDate: formValue.birthDate,
                jobTitle: formValue.jobTitle,
                organizationId: formValue.organizationId,
                operationalStatus: formValue.operationalStatus,
                prefixId: formValue.prefixId,
                title: formValue.title,
                // Passport data only for outside Oman users
                passportNo: !formValue.insideOman ? formValue.passportNo : undefined,
                passportBucketName: !formValue.insideOman && formValue.passportBucketName ? formValue.passportBucketName : undefined,
                passportFileName: !formValue.insideOman && formValue.passportFileName ? formValue.passportFileName : undefined,
                // Notification settings
                receiveSms: this.receiveSms,
                receiveEmails: this.receiveEmails,
                // Account type
                externalUser: this.user.externalUser,
                // Location fields
                wilayatId: formValue.wilayatId,
                governorateId: formValue.governorateId,
                groupId: formValue.centerId,
                groupCode: groupCode,
                isDeleted: false
            },
            notes: notes
        };

        this.usersManagementService.addUser(payload).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.isDisabled = true;
                this.emailForm.disable();
                
                // Navigate to success page
                this.router.navigate(['/jawda/users-permissions-management/users/success'], {
                    queryParams: { returnTab: this.returnTab }
                });
            },
            error: (error) => {
                this.isSubmitting = false;
                let errorMessage = error.error?.message || error.error?.errorMessage || error.message || 'PAGES.COMMON.MESSAGES.SAVE_ERROR';

                if (error === 'EMAIL_ALREADY_EXISTS') {
                    errorMessage = 'PAGES.COMMON.MESSAGES.EMAIL_ALREADY_EXISTS';
                }

                this.showError(errorMessage);
            }
        });
    }

    private showError(messageKey: string): void {
        scrollTo(0, 0);
        this.toastService.show(
            this.translate.instant(messageKey),
            { classname: 'bg-danger text-white', autohide: false }
        );
    }

    // private getOrganizationName(organizationId: number | undefined): string {
    //     if (!organizationId) return '';
    //     const org = this.organizationList.find(o => o.id === organizationId);
    //     return this.translate.currentLang === 'ar' ? (org?.lookupValueAr || '') : (org?.lookupValueEn || '');
    // }

    private noSpacesValidator() {
        return (control: any) => {
            if (!control.value) {
                return null;
            }
            if (control.value.includes(' ')) {
                return { noSpacesAllowed: true };
            }
            return null;
        };
    }

    /**
     * Custom validator to prevent Arabic characters in username
     */
    private noArabicValidator() {
        return (control: any) => {
            if (!control.value) {
                return null;
            }
            // Arabic Unicode range: \u0600-\u06FF
            const arabicPattern = /[\u0600-\u06FF]/;
            if (arabicPattern.test(control.value)) {
                return { arabicNotAllowed: true };
            }
            return null;
        };
    }

}
