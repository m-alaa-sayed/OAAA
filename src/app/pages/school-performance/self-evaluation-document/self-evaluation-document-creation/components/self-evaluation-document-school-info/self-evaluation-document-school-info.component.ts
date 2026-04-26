import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SelfEvaluationDocument} from 'src/app/pages/school-performance/types/self-evaluation-document';
import {SchoolInfo} from 'src/app/pages/school-performance/types/school-info';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
  selector: 'self-evaluation-document-school-info',
  templateUrl: './self-evaluation-document-school-info.component.html',
  styleUrl: './self-evaluation-document-school-info.component.scss'
})
export class SelfEvaluationDocumentSchoolInfoComponent implements OnInit {


  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
  @Input() showButtons: boolean = true;

  @Output() saveEvent = new EventEmitter<void>();
  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  isEditable: boolean = false;

  constructor(
    public translate: TranslateService,
    public toastService: ToastService) {
  }

  ngOnInit(): void {
    this.isEditable = this.selfEvaluationDocument.status != 'SUBMITTED';
  }

  save() {
    if (this.checkStudentCountMatch(this.selfEvaluationDocument.editableSchoolInfo)) {
      this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MESSAGES.STUDENT_DATA_VALIDATION'), { classname: 'bg-danger text-white', autohide: false });
      return;
    }
    this.saveEvent.emit()
  }

  next() {
    if (this.checkStudentCountMatch(this.selfEvaluationDocument.editableSchoolInfo)) {
      this.toastService.show(this.translate.instant('PAGES.SCHOOL_PERFORMANCE.MESSAGES.STUDENT_DATA_VALIDATION'), { classname: 'bg-danger text-white', autohide: false });
      return;
    }
    this.nextEvent.emit()
  }

  private checkStudentCountMatch(schoolInfo: SchoolInfo): boolean {
    const totalByGender = schoolInfo?.studentCountByGender?.total ?? 0;
    const totalByStage =
      (schoolInfo?.studentCountByStage?.stage1to4 ?? 0) +
      (schoolInfo?.studentCountByStage?.stage5to8 ?? 0) +
      (schoolInfo?.studentCountByStage?.stage9to12 ?? 0);

    return totalByGender != totalByStage;
  }
}
