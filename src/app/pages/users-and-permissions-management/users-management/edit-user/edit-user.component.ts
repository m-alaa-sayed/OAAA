import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { first, forkJoin } from 'rxjs';
import { CountryDto } from 'src/app/core/models/country-dto';
import { SystemLookupDto } from 'src/app/core/models/system-lookup-dto';
import { GovernorateDto } from 'src/app/core/models/governorate-dto';
import { CommonService } from 'src/app/core/services/common.service';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { ToastService } from 'src/app/core/services/toast-service';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { UserFormPayload } from '../../models/users.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  userId: string | null = null;

  user: UserFormPayload = {} as UserFormPayload;
  countryList: CountryDto[] = [];
  genderList: SystemLookupDto[] = [];
  prefixList: SystemLookupDto[] = [];
  governorateList: GovernorateDto[] = [];
  organizationList: SystemLookupDto[] = [];
  centerList: any[] = [];
  historyData: any[] = [];
  isDisabled: boolean = false;
  disableSubmitting: boolean = true;
  returnTab: number = 1; // Default to users tab
  mode: string = 'edit'; // Default mode
  pageTitleKey: string = '';

  userData: any = {
    email: '',
    receiveSms: false,
    receiveEmails: false
  };

  showValidationErrors: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private commonService: CommonService,
    private toastService: ToastService,
    private usersManagementService: UsersManagementService,
    private modalService: NgbModal

  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');

    const returnTabParam = this.route.snapshot.queryParamMap.get('returnTab');
    if (returnTabParam) {
      this.returnTab = +returnTabParam;
    }

    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    if (modeParam) {
      this.mode = modeParam;
      this.isDisabled = modeParam === 'readOnly';
    }

    let pageTitleKey = 'PAGES.PERMISSIONS_MANAGEMENT.TITLES.VIEW_USER_ACCOUNT_DATA';
    if (this.mode === 'edit') {
      pageTitleKey = 'PAGES.PERMISSIONS_MANAGEMENT.TITLES.EDIT_USER_ACCOUNT_DATA';
    }

    this.breadCrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.TITLES.USERS_AND_PERMISSIONS_MANAGEMENT'), link: '/jawda/users-permissions-management' },
      { label: this.translate.instant(pageTitleKey), active: true }
    ];
    this.pageTitleKey = pageTitleKey;
    this.loadLookups();
    this.loadUserDetails();
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
      },
      error: (err) => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  loadUserDetails(): void {
    if (!this.userId) {
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
        { classname: 'bg-danger text-white', autohide: false }
      );
      return;
    }

    this.usersManagementService.getUserById(this.userId).subscribe({
      next: (response: any) => {
        const userDetails = response.data;

        // Map API response to user object (UserFormPayload)
        this.user = {
          id: userDetails.id,
          email: userDetails.email,
          username: userDetails.username,
          fullNameAr: userDetails.fullNameAr,
          fullNameEn: userDetails.fullNameEn,
          mobileNo: userDetails.mobileNo,
          civilNo: userDetails.civilNo,
          externalUser: userDetails.externalUser,
          status: userDetails.status,
          insideOman: userDetails.insideOman,
          firstNameEn: userDetails.firstNameEn,
          secondNameEn: userDetails.secondNameEn,
          thirdNameEn: userDetails.thirdNameEn,
          lastNameEn: userDetails.lastNameEn,
          firstNameAr: userDetails.firstNameAr,
          secondNameAr: userDetails.secondNameAr,
          thirdNameAr: userDetails.thirdNameAr,
          lastNameAr: userDetails.lastNameAr,
          cityId: userDetails.cityId,
          genderId: userDetails.genderId,
          nationalityId: userDetails.nationalityId,
          title: userDetails.title,
          birthDate: this.formatDateInput(userDetails.birthDate),
          jobTitle: userDetails.jobTitle,
          organizationId: userDetails.organizationId,
          phoneNo: userDetails.phoneNo,
          streetAddress: userDetails.address,
          operationalStatus: userDetails.operationalStatus,
          passportNo: userDetails.passportNo,
          passportBucketName: userDetails.passportBucketName,
          passportFileName: userDetails.passportFileName,
          prefixId: userDetails.prefixId,
          phoneNoKeyId: userDetails.phoneNoKeyId,
          mobileNoKeyId: userDetails.mobileNoKeyId,
          wilayatId: userDetails.wilayatId,
          governorateId: userDetails.governorateId,
          residentialCountryId: userDetails.countryId,
          centerId: userDetails.groupId ?? userDetails.group?.id ?? undefined,
          city: typeof userDetails.city === 'object' ? userDetails.city : undefined,
          country: userDetails.country,
          governorate: userDetails.governorate,
          wilayat: userDetails.wilayat,
          userRoles: userDetails.userRoles,
        };

        // Map notification settings
        this.userData = {
          email: userDetails.email || '',
          receiveSms: userDetails.receiveSms || false,
          receiveEmails: userDetails.receiveEmails || false
        };
        // until user changes something keep submit disabled
        this.disableSubmitting = true;

        // Map audit events to match the expected format
        this.historyData = (userDetails.usersAuditEvents || []).map((event: any) => ({
          id: event.id,
          operationType: event.operationTypeCode,
          createdOn: event.createdOn,
          notes: event.notes,
          userFullNameAr: event.actorUserFullNameAr,
          userFullNameEn: event.actorUserFullNameEn
        }));

      },
      error: (error) => {
        this.toastService.show(
          error.error?.message || this.translate.instant('PAGES.COMMON.MESSAGES.LOAD_ERROR'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  enableEdit(): void {
    this.isDisabled = false;
    this.disableSubmitting = true;
  }

  goBack(): void {
    this.router.navigate(['/jawda/users-permissions-management'], {
      queryParams: { returnTab: this.returnTab }
    });
  }

  emailExistsError: boolean = false;
  usernameExistsError: boolean = false;

  save(): void {
    if (!this.userId) {
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.INVALID_DATA'),
        { classname: 'bg-danger text-white', autohide: false }
      );
      return;
    }

    this.showValidationErrors = true;
    this.emailExistsError = false;
    this.usernameExistsError = false;

    if (!this.validateForm()) {
      this.toastService.show(
        this.translate.instant('PAGES.COMMON.MESSAGES.REQUIRED_FIELDS_MISSING'),
        { classname: 'bg-danger text-white', autohide: false }
      );
      return;
    }

    // Map UserFormPayload to UserDetailsDto
    const birthDate = this.normalizeBirthDate(this.user.birthDate);
    const userData: any = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      fullNameAr: this.user.fullNameAr,
      fullNameEn: this.user.fullNameEn,
      mobileNo: this.user.mobileNo,
      civilNo: this.user.civilNo,
      externalUser: this.user.externalUser,
      status: this.user.status,
      insideOman: this.user.insideOman,
      firstNameEn: this.user.firstNameEn,
      secondNameEn: this.user.secondNameEn,
      thirdNameEn: this.user.thirdNameEn,
      lastNameEn: this.user.lastNameEn,
      firstNameAr: this.user.firstNameAr,
      secondNameAr: this.user.secondNameAr,
      thirdNameAr: this.user.thirdNameAr,
      lastNameAr: this.user.lastNameAr,
      cityId: this.user.cityId,
      genderId: this.user.genderId,
      nationalityId: this.user.nationalityId,
      title: this.user.title,
      birthDate: birthDate ? birthDate.toISOString().split('T')[0] : null,
      jobTitle: this.user.jobTitle,
      organizationId: this.user.organizationId,
      phoneNo: this.user.phoneNo,
      address: this.user.streetAddress,
      operationalStatus: this.user.operationalStatus,
      passportNo: this.user.passportNo,
      passportBucketName: this.user.passportBucketName,
      passportFileName: this.user.passportFileName,
      prefixId: this.user.prefixId,
      phoneNoKeyId: this.user.phoneNoKeyId,
      mobileNoKeyId: this.user.mobileNoKeyId,
      wilayatId: this.user.wilayatId,
      governorateId: this.user.governorateId,
      countryId: this.user.residentialCountryId,
      receiveSms: this.userData.receiveSms,
      receiveEmails: this.userData.receiveEmails,
      groupId: this.user.centerId,
      userRoles: this.user.userRoles
    };

    const message = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.EDIT_USER_CONFIRMATION_MESSAGE');
    const title = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.EDIT_USER');
    const notesLabel: string = this.translate.instant('PAGES.COMMON.LABELS.NOTES'); // Label for notes field


    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true, notesLabel).then((result) => {
      if (result.confirmed) {
        this.usersManagementService.updateUserProfile(this.userId!, userData, result.notes).subscribe({
          next: (response) => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'),
              { classname: 'bg-success text-white', autohide: true, delay: 3000 }
            );
            this.isDisabled = true;
            this.disableSubmitting = true;

            setTimeout(() => {
              this.goBack();
            }, 1500);
          },
          error: (error) => {
            let errorCode: string | undefined;
            if (typeof error === 'string') {
              errorCode = error;
            } else {
              errorCode = error.error?.errorCode || error.error?.data?.errorCode || error.error?.code || error;
            }

            let errorMessage: string;
            if (errorCode === 'USERNAME_ALREADY_EXISTS') {
              this.usernameExistsError = true;
              errorMessage = this.translate.instant('PAGES.COMMON.MESSAGES.USERNAME_ALREADY_EXISTS');
            } else if (errorCode === 'EMAIL_ALREADY_EXISTS') {
              this.emailExistsError = true;
              errorMessage = this.translate.instant('PAGES.COMMON.MESSAGES.EMAIL_ALREADY_EXISTS');
            } else {
              errorMessage = error.error?.errorMessage || this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_ERROR');
            }

            window.scrollTo(0, 0);
            
            this.toastService.show(
              errorMessage,
              { classname: 'bg-danger text-white', autohide: false }
            );
          }
        });
      }
    });
  }

  validateForm(): boolean {
    const requiredFields = [
      this.user.firstNameAr, this.user.secondNameAr, this.user.thirdNameAr, this.user.lastNameAr,
      this.user.firstNameEn, this.user.secondNameEn, this.user.thirdNameEn, this.user.lastNameEn,
      this.user.mobileNo, this.user.mobileNoKeyId, this.user.residentialCountryId, this.user.email, this.user.username
    ];

    if (requiredFields.some(field => !field)) return false;

    if (this.user.insideOman) {
      if (!this.user.civilNo) return false;
    } else {
      if (!this.user.passportNo) return false;
    }

    if (!this.user.externalUser && !this.user.centerId) return false;

    const mobilePattern = /^\+?[1-9]\d{7,14}$/;
    if (!mobilePattern.test(this.user.mobileNo!)) return false;

    if (this.user.phoneNo) {
      const phonePattern = /^\+?[1-9]\d{1,14}$/;
      if (!phonePattern.test(this.user.phoneNo)) return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.user.email && !emailRegex.test(this.user.email)) return false;

    return true;
  }

  private normalizeBirthDate(birthDate?: Date | string | null): Date | null {
    if (!birthDate) {
      return null;
    }

    if (birthDate instanceof Date) {
      return isNaN(birthDate.getTime()) ? null : birthDate;
    }

    const parsed = new Date(birthDate);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  private formatDateInput(birthDate?: Date | string | null): string | null {
    if (!birthDate) {
      return null;
    }

    if (birthDate instanceof Date) {
      return isNaN(birthDate.getTime()) ? null : birthDate.toISOString().split('T')[0];
    }

    const parsed = new Date(birthDate);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString().split('T')[0];
  }

}
