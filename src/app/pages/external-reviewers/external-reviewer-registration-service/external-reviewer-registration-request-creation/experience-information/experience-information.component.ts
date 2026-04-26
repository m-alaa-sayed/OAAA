import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ExternalReviewersRegistrationRequestInfo } from '../../../types/external-reviewers-registration-request-info';
import { ServiceManagementService } from 'src/app/core/services/service-management.service';
import { ExternalReviewerAttachments } from '../../../types/external-reviewer-attachments';
import { NgForm } from '@angular/forms';
import { ExperienceInformationCheqaComponent } from '../experience-information-cheqa/experience-information-cheqa.component';
import { ExperienceInformationCseqaComponent } from '../experience-information-cseqa/experience-information-cseqa.component';
import { ExperienceInformationOqfComponent } from '../experience-information-oqf/experience-information-oqf.component';
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-experience-information',
  templateUrl: './experience-information.component.html',
  styleUrl: './experience-information.component.scss'
})
export class ExperienceInformationComponent implements OnInit {

  @ViewChild("submitForm") submitForm?: NgForm;

  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() isEditMode: boolean = false;
  @Input() showButtons: boolean = true;


  @ViewChild('cheqaComp') cheqaComp?: ExperienceInformationCheqaComponent;
  @ViewChild('cseqaComp') cseqaComp?: ExperienceInformationCseqaComponent;
  @ViewChild('oqfComp') oqfComp?: ExperienceInformationOqfComponent;



  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();


  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    public translate: TranslateService,
    private serviceManagementService: ServiceManagementService) {
  }


  ngOnInit(): void {
    // if (!this.externalReviewersRegistrationRequestInfo.cheqaExperience) {
    //   this.externalReviewersRegistrationRequestInfo.cheqaExperience = {};
    // }
  }








  addAttchment(attachmentObject: ExternalReviewerAttachments) {
    if (!this.externalReviewersRegistrationRequestInfo.attachmentList) {
      this.externalReviewersRegistrationRequestInfo.attachmentList = []
    }
    this.externalReviewersRegistrationRequestInfo.attachmentList.push(attachmentObject);
  }

  removeAttchment(index: number) {
    this.externalReviewersRegistrationRequestInfo.attachmentList?.splice(index, 1);
  }


  next() {
    this.isSubmitting = true;
    const comp = this.cheqaComp || this.cseqaComp || this.oqfComp;

    if (comp) {
      if (comp instanceof ExperienceInformationCheqaComponent && comp.cheqaForm?.invalid) {
        scrollTo(0, 0);
        return;
      }
      if (comp instanceof ExperienceInformationCseqaComponent && (comp.cseqaForm?.invalid
        || (!this.externalReviewersRegistrationRequestInfo.sceqaExperience.resumeFileName)
        || (!this.externalReviewersRegistrationRequestInfo.sceqaExperience.degreeCertificateFileName)
        || (!this.externalReviewersRegistrationRequestInfo.sceqaExperience.idCardFileName && this.externalReviewersRegistrationRequestInfo.insideOman)
        || (!this.externalReviewersRegistrationRequestInfo.sceqaExperience.approvalLetterFileName && !this.externalReviewersRegistrationRequestInfo.insideOman)
        || (!this.externalReviewersRegistrationRequestInfo.sceqaExperience.jobTitleProofFileName && !this.externalReviewersRegistrationRequestInfo.insideOman)
      )

      ) {
        scrollTo(0, 0);
        return;
      }
      if (comp instanceof ExperienceInformationOqfComponent &&
        (comp.oqfForm?.invalid || !this.externalReviewersRegistrationRequestInfo.oqfExperience.resumeBucketName)) {
        scrollTo(0, 0);
        return;
      }
    }

    this.nextEvent.emit()
  }


  onTextChange(): void {
    const result = limitWords(this.externalReviewersRegistrationRequestInfo.externalReviewerNotes || '', 250);
    this.externalReviewersRegistrationRequestInfo.externalReviewerNotes = result.trimmedText;
  }
}
