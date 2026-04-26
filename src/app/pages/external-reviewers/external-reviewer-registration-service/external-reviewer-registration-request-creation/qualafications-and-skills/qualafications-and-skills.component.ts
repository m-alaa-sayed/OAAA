import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {SystemLookupDto} from 'src/app/core/models/system-lookup-dto';
import {BaseModal} from 'src/app/shared/base-modal';
import {BroadField} from '../../../types/broad-field';
import {NarrowField} from '../../../types/narrow-field';
import {ExternalReviewerRegistrationService} from '../../../services/external-reviewer-registration.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewersRegistrationRequestInfo} from '../../../types/external-reviewers-registration-request-info';
import {ExternalReviewerExpertiseAreas} from '../../../types/external-reviewer-expertise-areas';
import {ExternalReviewerLanguageSkills} from '../../../types/external-reviewer-language-skills';
import {NgForm} from '@angular/forms';
import {CommonService} from "../../../../../core/services/common.service";
import {ExternalReviewerValidationService} from '../../../services/external-reviewer-validation.service';
import {GeneralSpecialization} from '../../../types/general-specialization';
import {SpecificSpecialization} from '../../../types/specific-specialization';
import {CseqaGeneralSpecialization} from '../../../types/cseqa-general-specialization';
import {CseqaSpecificSpecialization} from '../../../types/cseqa-specific-specialization';
import {limitWords} from 'src/app/shared/utils/word-utils';
import {ExternalReviewerExpertiseYears} from '../../../types/external-reviewer-expertise-years';

@Component({
  selector: 'app-qualafications-and-skills',
  templateUrl: './qualafications-and-skills.component.html',
  styleUrl: './qualafications-and-skills.component.scss'
})
export class QualaficationsAndSkillsComponent extends BaseModal implements OnInit, OnDestroy {



  @ViewChild("submitForm") submitForm?: NgForm;

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() languageList: SystemLookupDto[] = [];
  @Input() higherEducationList: SystemLookupDto[] = [];
  @Input() institutionList: SystemLookupDto[] = [];
  @Input() broadFieldList: BroadField[] = [];
  @Input() generalSpecializationList: GeneralSpecialization[] = [];
  @Input() cseqaGeneralSpecializationList: CseqaGeneralSpecialization[] = [];
  @Input() cseqaSpecificSpecializationList: CseqaSpecificSpecialization[] = [];
  @Input() expertiseYearList: SystemLookupDto[] = [];
  @Input() showButtons: boolean = true;
  @Input() isEditMode: boolean = false;


  narrowFieldList: NarrowField[] = [];
  specificSpecializationList: SpecificSpecialization[] = [];
  languageDegreeList = [
    { id: 1, nameEn: 'Beginner', nameAr: 'مبتدئ جداً' },
    { id: 2, nameEn: 'Elementary', nameAr: 'مبتدئ' },
    { id: 3, nameEn: 'Intermediate', nameAr: 'متوسط' },
    { id: 4, nameEn: 'Advanced', nameAr: 'متقدم' },
    { id: 5, nameEn: 'Native', nameAr: 'متحدث أصلي' }
  ];
  generalCode?: string;
  boardCode?: string;
  cseqaGeneralCode?: string;
  cseqaSpecificCode?: string;

  expertiseAreaObject: ExternalReviewerExpertiseAreas = {} as ExternalReviewerExpertiseAreas;
  languageSkillObject: ExternalReviewerLanguageSkills = {} as ExternalReviewerLanguageSkills
  expertiseYearsObject: ExternalReviewerExpertiseYears = {} as ExternalReviewerExpertiseYears;

  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();



  list: any[] = [];
  isSubmitting: boolean = false;
  addMoreLanguage: boolean = false;

  years: number[] = [];
  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  passportSelectedFileName: string | null = null;
  editPasswordData: boolean = false;
  profileImagePreviewUrl: string | null = null;
  editIndex: number | null = null;
  editYearsIndex: number | null = null;


  constructor(
    public override modalService: NgbModal,
    public translate: TranslateService,
    private toastService: ToastService,
    private commonService: CommonService,
    private externalReviewerRegistrationService: ExternalReviewerRegistrationService,
    private externalReviewerValidationService: ExternalReviewerValidationService
  ) {
    super(modalService);
  }

  get availableLanguages(): SystemLookupDto[] {
    const selectedIds = this.externalReviewersRegistrationRequestInfo.languageSkillList?.map(item => item.language?.id) || [];
    return this.languageList.filter(lang => !selectedIds.includes(lang.id));
  }


  ngOnInit(): void {

    if (!this.isEditMode) {
      this.editPasswordData = true;
    }
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();

    if (!this.externalReviewersRegistrationRequestInfo.qualification) {
      this.externalReviewersRegistrationRequestInfo.qualification = {};
    }
    if (!this.externalReviewersRegistrationRequestInfo.qualification.specificSpecialization) {
      this.externalReviewersRegistrationRequestInfo.qualification.specificSpecialization = {};
    }
    this.passportSelectedFileName = this.externalReviewersRegistrationRequestInfo.passportFileName || "";
    this.selectedFileName = this.externalReviewersRegistrationRequestInfo.profilePictureFileName || "";

    this.addMoreLanguage = (this.externalReviewersRegistrationRequestInfo.languageSkillList &&
      this.externalReviewersRegistrationRequestInfo.languageSkillList.length > 0) || false;

    // Load existing profile picture if available
    if (this.externalReviewersRegistrationRequestInfo.profilePictureFileName &&
      this.externalReviewersRegistrationRequestInfo.profilePictureBucketName) {
      this.loadExistingProfilePicture();
    }
    this.externalReviewerValidationService.externalReviewerRegistrationApprovalData$.subscribe(message => {
      this.isSubmitting = message;
    });

    if (this.externalReviewersRegistrationRequestInfo.module == 'CHEQA' && this.externalReviewersRegistrationRequestInfo.qualification.generalSpecializationId) {
      this.generalCode = this.generalSpecializationList?.find(n => n.id === this.externalReviewersRegistrationRequestInfo.qualification.generalSpecializationId)?.code || "";
      this.getSpecificSpecializationsByGeneralId(this.externalReviewersRegistrationRequestInfo.qualification.generalSpecializationId);
    }
  }


  removeYearsExpertiseAreaItem(index: number): void {
    this.externalReviewersRegistrationRequestInfo.expertiseYearList?.splice(index, 1);
  }

  removeExpertiseAreaItem(index: number): void {
    this.externalReviewersRegistrationRequestInfo.expertiseAreaList?.splice(index, 1);
  }

  removeLangItem(index: number): void {
    this.externalReviewersRegistrationRequestInfo.languageSkillList?.splice(index, 1);
  }

  onBoardFieldChange(event: any) {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.externalReviewerRegistrationService.getNarrowFields(selectedId).subscribe({
      next: (res) => {
        this.narrowFieldList = res;
        this.expertiseAreaObject.boardField = this.broadFieldList.find(b => b.id === selectedId) || {};
        this.boardCode = this.broadFieldList?.find(n => n.id === selectedId)?.code || "";
        if (this.boardCode === '14') {
          this.expertiseAreaObject.narrowField = {};
        }
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  onGeneralSpecializationChange(event: any) {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.getSpecificSpecializationsByGeneralId(selectedId);
    this.generalCode = this.generalSpecializationList?.find(n => n.id === selectedId)?.code || "";

    if (selectedId == 14 && this.externalReviewersRegistrationRequestInfo.module !== 'CSEQA')
      this.externalReviewersRegistrationRequestInfo.qualification.specificSpecializationId = 84;
  }

  private getSpecificSpecializationsByGeneralId(id: number) {
    this.externalReviewerRegistrationService.getSpecificSpecializations(id).subscribe({
      next: (res) => {
        this.specificSpecializationList = res;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  onNarrowFieldChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.expertiseAreaObject.narrowField = this.narrowFieldList.find(n => n.id === selectedId) || {};
  }

  onLangChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.languageSkillObject.language = this.languageList?.find(n => n.id === selectedId) || {};
  }

  onInstitutionChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.externalReviewersRegistrationRequestInfo.qualification.institution = this.institutionList?.find(n => n.id === selectedId) || {};
  }

  onSpecificSpecializationChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.generalCode = this.generalSpecializationList?.find(n => n.id === selectedId)?.code || "";
  }
  onCseqaGeneralSpecializationChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.cseqaGeneralCode = this.cseqaGeneralSpecializationList?.find(n => n.id === selectedId)?.id?.toString() || "";
  }
  onCseqaSpecificSpecializationChange(event: Event): void {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.cseqaSpecificCode = this.cseqaSpecificSpecializationList?.find(n => n.id === selectedId)?.id?.toString() || "";
  }
  onFileSelected(event: any, isPassport: boolean): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create preview URL for profile picture
      if (!isPassport && file.type.startsWith('image/')) {
        if (this.profileImagePreviewUrl) {
          URL.revokeObjectURL(this.profileImagePreviewUrl);
        }
        this.profileImagePreviewUrl = URL.createObjectURL(file);
      }

      this.uploadFile(isPassport);
    }
  }



  uploadFile(isPassport: boolean): void {
    if (!this.selectedFile) {
      return;
    }
    const bucket = 'oaaaqa';
    this.commonService.uploadFileToOci(bucket, this.selectedFile)
      .subscribe({
        next: (response) => {
          const data = response.data;
          if (isPassport) {
            this.externalReviewersRegistrationRequestInfo.passportBucketName = response.data.bucketName;
            this.externalReviewersRegistrationRequestInfo.passportFileName = response.data.objectName;
            this.passportSelectedFileName = response.data.objectName;
          }
          else {
            this.externalReviewersRegistrationRequestInfo.profilePictureFileName = response.data.objectName;
            this.externalReviewersRegistrationRequestInfo.profilePictureBucketName = response.data.bucketName;
            this.selectedFileName = response.data.objectName;
          }
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false })
        }
      });
  }



  addExpertiseToList(): void {
    if (!this.externalReviewersRegistrationRequestInfo.expertiseAreaList) {
      this.externalReviewersRegistrationRequestInfo.expertiseAreaList = [];
    }

    if (this.editIndex !== null) {
      this.externalReviewersRegistrationRequestInfo.expertiseAreaList[this.editIndex] = { ...this.expertiseAreaObject };
      this.editIndex = null;
    } else {
      this.externalReviewersRegistrationRequestInfo.expertiseAreaList.push({ ...this.expertiseAreaObject });
    }

    this.expertiseAreaObject = {};
    this.boardCode = '';
    this.close();
  }


  addLangToList() {
    if (!this.externalReviewersRegistrationRequestInfo.languageSkillList) {
      this.externalReviewersRegistrationRequestInfo.languageSkillList = [];
    }
    this.externalReviewersRegistrationRequestInfo.languageSkillList?.push(this.languageSkillObject);
    this.languageSkillObject = {};
    this.close();
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

  loadExistingProfilePicture(): void {
    if (this.externalReviewersRegistrationRequestInfo.profilePictureFileName &&
      this.externalReviewersRegistrationRequestInfo.profilePictureBucketName) {
      this.commonService.getOciPreAuthenticatedUrl(
        this.externalReviewersRegistrationRequestInfo.profilePictureBucketName,
        this.externalReviewersRegistrationRequestInfo.profilePictureFileName
      ).subscribe({
        next: (res) => {
          this.profileImagePreviewUrl = res.data;
        },
        error: (err) => {
          console.error('Error loading profile picture:', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Clean up preview URL to prevent memory leaks
    if (this.profileImagePreviewUrl) {
      URL.revokeObjectURL(this.profileImagePreviewUrl);
    }
  }


  cancelExpertise(): void {
    this.expertiseAreaObject = {};
    this.boardCode = '';
    this.editIndex = null;
    this.close();
  }

  cancelYearsExpertise(): void {
    this.expertiseYearsObject = {};
    this.editYearsIndex = null;
    this.close();
  }

  addYearsExpertiseToList() {
    if (!this.externalReviewersRegistrationRequestInfo.expertiseYearList) {
      this.externalReviewersRegistrationRequestInfo.expertiseYearList = [];
    }
    this.expertiseYearsObject.duration = this.getDurationInYears();
    if (this.editYearsIndex !== null) {
      this.externalReviewersRegistrationRequestInfo.expertiseYearList[this.editYearsIndex] = { ...this.expertiseYearsObject };
      this.editIndex = null;
    } else {
      this.externalReviewersRegistrationRequestInfo.expertiseYearList.push({ ...this.expertiseYearsObject });
    }
    this.expertiseYearsObject = {};
    this.close();

  }

  private getDurationInYears(): number {
    const start = this.expertiseYearsObject.academicYearFrom;
    const end = this.expertiseYearsObject.academicYearTo;

    if (end && start) {
      const startYear = new Date(start).getFullYear();
      const endYear = new Date(end).getFullYear();
      return endYear - startYear
    }

    return 0;
  }

  onEmlpyeeChanged(event: Event) {
    const selectedId = +(event.target as HTMLSelectElement).value;
    this.expertiseYearsObject.employee = this.expertiseYearList?.find(n => n.id === selectedId) || {};
  }


  cancelLang() {
    this.languageSkillObject = {};
    this.close();
  }


  next() {
    this.isSubmitting = true;
    if (this.submitForm?.invalid || !this.externalReviewersRegistrationRequestInfo.profilePictureFileName) {
      this.showErrorMessage('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT');
      return;
      // scrollTo(0, 0);
      // this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), { classname: 'bg-danger text-white', autohide: false });
      // return;
    }
    else if (this.externalReviewersRegistrationRequestInfo.module == 'CSEQA' &&
      (!this.externalReviewersRegistrationRequestInfo.expertiseYearList
        || this.externalReviewersRegistrationRequestInfo.expertiseYearList.length == 0)) {
      this.showErrorMessage('PAGES.EXTERNAL_REVIEWER.MESSAGES.ADD_YEARS_OF_EXPERIENCE');
      return;
    }

    this.nextEvent.emit()
  }

  private showErrorMessage(message: string) {
    scrollTo(0, 0);
    this.toastService.show(this.translate.instant(message), { classname: 'bg-danger text-white', autohide: false });
  }


  isExpertiseAreaSaveDisabled(): boolean {
    if (this.boardCode === '14') {
      return !this.expertiseAreaObject.otherNarrowFieldAr ||
        !this.expertiseAreaObject.otherNarrowFieldEn;
    }
    return !this.expertiseAreaObject.boardFieldId ||
      !this.expertiseAreaObject.narrowFieldId;
  }

  editExpertiseAreaItem(item: ExternalReviewerExpertiseAreas, index: number, content: any): void {
    this.editIndex = index;
    this.expertiseAreaObject = { ...item };
    this.expertiseAreaObject.boardFieldId = item.boardField?.id;
    this.expertiseAreaObject.narrowFieldId = item.narrowField?.id;

    this.boardCode = item.boardField?.code || '';

    if (this.expertiseAreaObject.boardFieldId) {
      this.externalReviewerRegistrationService.getNarrowFields(this.expertiseAreaObject.boardFieldId).subscribe({
        next: (res) => {
          this.narrowFieldList = res;
          this.open(content);
        },
        error: (error) => {
          this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
        }
      });
    } else {
      this.open(content);
    }
  }


  editYearsExpertiseAreaItem(item: ExternalReviewerExpertiseYears, index: number, content: any) {
    this.editYearsIndex = index;
    this.expertiseYearsObject = { ...item };
    this.open(content);
  }

  onTextChange(obj: any, field: string, value: string): void {
    const result = limitWords(value || '', 250);
    obj[field] = result.trimmedText;
  }

}

