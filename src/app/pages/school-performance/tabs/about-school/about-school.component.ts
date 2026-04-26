import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { School } from '../../types/school';
import { SchoolAboutData, SchoolInfo } from "../../types/school-info";
import { ModalConfirmComponent } from '../../../../shared/app-modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-about-school',
  templateUrl: './about-school.component.html',
  styleUrls: ['./about-school.component.scss']
})
export class AboutSchoolComponent implements OnInit, OnChanges {

  @Input() schoolInfo!: SchoolInfo;
  @Input() isEditable: boolean = false;


  constructor(
    private translate: TranslateService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schoolData'] && changes['schoolData'].currentValue) {
      this.initializeData(); // Re-initialize data if schoolData changes
    }
  }

  private initializeData(): void {
    // Use mocked data for now, but keep schoolData input available for future use
    if (!this.schoolInfo.schoolAboutData) {
      this.schoolInfo.schoolAboutData = {
        vision: '',
        mission: '',
        strategicGoals: '',
        generalOverview: '',
        majorDevelopments: ''
      };
    }

    // Future: Use school data when available
    // if (this.schoolData) {
    //   this.schoolInfo.schoolAboutData = {
    //     vision: this.schoolData.vision || '',
    //     mission: this.schoolData.mission || '',
    //     strategicGoals: this.schoolData.strategicGoals || '',
    //     generalOverview: this.schoolData.generalOverview || '',
    //     majorDevelopments: this.schoolData.majorDevelopments || ''
    //   };
    // }
  }

  getVisionWordCount(): number {
    return this.schoolInfo.schoolAboutData.vision ? this.schoolInfo.schoolAboutData.vision.trim().split(/\s+/).length : 0;
  }

  getMissionWordCount(): number {
    return this.schoolInfo.schoolAboutData.mission ? this.schoolInfo.schoolAboutData.mission.trim().split(/\s+/).length : 0;
  }

  getStrategicGoalsWordCount(): number {
    return this.schoolInfo.schoolAboutData.strategicGoals ? this.schoolInfo.schoolAboutData.strategicGoals.trim().split(/\s+/).length : 0;
  }

  getGeneralOverviewWordCount(): number {
    return this.schoolInfo.schoolAboutData.generalOverview ? this.schoolInfo.schoolAboutData.generalOverview.trim().split(/\s+/).length : 0;
  }

  getMajorDevelopmentsWordCount(): number {
    return this.schoolInfo.schoolAboutData.majorDevelopments ? this.schoolInfo.schoolAboutData.majorDevelopments.trim().split(/\s+/).length : 0;
  }

  getTotalWordCount(): number {
    return this.getVisionWordCount() +
      this.getMissionWordCount() +
      this.getStrategicGoalsWordCount() +
      this.getGeneralOverviewWordCount() +
      this.getMajorDevelopmentsWordCount();
  }

  getCompletionPercentage(): number {
    let completedFields = 0;
    if (this.schoolInfo.schoolAboutData.vision && this.schoolInfo.schoolAboutData.vision.trim().length > 0) completedFields++;
    if (this.schoolInfo.schoolAboutData.mission && this.schoolInfo.schoolAboutData.mission.trim().length > 0) completedFields++;
    if (this.schoolInfo.schoolAboutData.strategicGoals && this.schoolInfo.schoolAboutData.strategicGoals.trim().length > 0) completedFields++;
    if (this.schoolInfo.schoolAboutData.generalOverview && this.schoolInfo.schoolAboutData.generalOverview.trim().length > 0) completedFields++;
    if (this.schoolInfo.schoolAboutData.majorDevelopments && this.schoolInfo.schoolAboutData.majorDevelopments.trim().length > 0) completedFields++;

    return Math.round((completedFields / 5) * 100);
  }

  onFieldChange(field: keyof SchoolAboutData, value: string): void {
    this.schoolInfo.schoolAboutData[field] = value;
    console.log(`Updated ${field}:`, value);
  }

  validateForm(): boolean {
    return this.schoolInfo.schoolAboutData.vision.trim().length > 0 &&
      this.schoolInfo.schoolAboutData.mission.trim().length > 0 &&
      this.schoolInfo.schoolAboutData.strategicGoals.trim().length > 0 &&
      this.schoolInfo.schoolAboutData.generalOverview.trim().length > 0 &&
      this.schoolInfo.schoolAboutData.majorDevelopments.trim().length > 0;
  }

  resetForm(): void {
    ModalConfirmComponent.openConfirm(
      this.modalService,
      this.translate.instant('PAGES.SCHOOL_PERFORMANCE.ABOUT_SCHOOL.CONFIRM_RESET'),
      this.translate.instant('PAGES.COMMON.LABELS.CONFIRM')
    ).then((confirmed) => {
      if (confirmed) {
        this.schoolInfo.schoolAboutData = {
          vision: '',
          mission: '',
          strategicGoals: '',
          generalOverview: '',
          majorDevelopments: ''
        };
      }
    });
  }

} 
