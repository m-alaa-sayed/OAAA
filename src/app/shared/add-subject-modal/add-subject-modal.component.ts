import { Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

export interface SubjectData {
  arabicName: string;
  englishName: string;
}

@Component({
  selector: 'app-add-subject-modal',
  templateUrl: './add-subject-modal.component.html',
  styleUrls: ['./add-subject-modal.component.scss']
})
export class AddSubjectModalComponent {
  @ViewChild('subjectForm') subjectForm!: NgForm;

  subject: SubjectData = {
    arabicName: '',
    englishName: ''
  };

  constructor(public activeModal: NgbActiveModal) {}

  isValid(): boolean {
    return this.subject.arabicName.trim() !== '' && 
           this.subject.englishName.trim() !== '';
  }

  onSave(): void {
    if (this.isValid()) {
      this.activeModal.close({
        arabicName: this.subject.arabicName.trim(),
        englishName: this.subject.englishName.trim()
      });
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}