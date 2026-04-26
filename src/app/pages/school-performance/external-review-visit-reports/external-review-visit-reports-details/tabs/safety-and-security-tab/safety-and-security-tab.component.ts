import { Component, Input } from '@angular/core';
import { VisitReportSubmissionRequestInfo } from 'src/app/pages/school-performance/types/visit-report-submission-request-info';
import { BaseTabComponent } from 'src/app/shared/tabs-template/base-tab.component';

@Component({
  selector: 'safety-and-security-tab',
  templateUrl: './safety-and-security-tab.component.html',
  styleUrl: './safety-and-security-tab.component.scss'
})
export class SafetyAndSecurityTabComponent extends BaseTabComponent {

  @Input() visitReportSubmissionRequestInfo: VisitReportSubmissionRequestInfo = {} as VisitReportSubmissionRequestInfo;

  @Input() isEditMode: boolean = false;
  @Input() importedSafetyForms: any[] = [];
  @Input() schoolView: boolean = false;
}
