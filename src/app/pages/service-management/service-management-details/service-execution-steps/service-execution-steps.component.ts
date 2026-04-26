import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, Output, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { OaaaServiceExecutionStepDto } from "../../types/oaaa-service-execution-step-dto";
import { limitWords } from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'service-execution-steps',
  standalone: false,
  templateUrl: './service-execution-steps.component.html',
  styleUrl: './service-execution-steps.component.scss'
})
export class ServiceExecutionStepsComponent {
  @Input() stepsList: OaaaServiceExecutionStepDto[] = [];
  @Input() isEdit: boolean = false;
  @Output() stepsListChange = new EventEmitter<OaaaServiceExecutionStepDto[]>();
  @ViewChild('formModal') formModal!: TemplateRef<any>;
  selectedDeleteIndex: number | null = null;

  formData: any = {};
  isPopupEdit = false;
  editingIndex = -1;
  modalRef: any;
  isSubmitting: boolean = false;
  constructor(private modalService: NgbModal) { }

  openModal(mode: 'add' | 'edit', row?: OaaaServiceExecutionStepDto) {
    this.isPopupEdit = (mode === 'edit');
    this.formData = row ? { ...row } : {};
    this.editingIndex = row ? this.stepsList.indexOf(row) : -1;
    this.modalService.open(this.formModal, { size: 'lg' });
  }

  updateListAndCloseModal(modal: any) {
    this.isSubmitting = true;
    if (!this.formData.stepNameAr?.trim() ||
      !this.formData.stepNameEn?.trim() ||
      !this.formData.stepDescriptionAr?.trim() ||
      !this.formData.stepDescriptionEn?.trim()) {
      return;
    }

    if (this.isPopupEdit && this.editingIndex !== -1) {
      this.stepsList[this.editingIndex] = { ...this.formData };
    } else {
      this.stepsList.push({ ...this.formData });
    }
    this.stepsListChange.emit(this.stepsList);
    modal.close();
  }

  openDeleteConfirmModal(content: any, index: number): void {
    this.selectedDeleteIndex = index;
    this.modalService.open(content, { centered: true });
  }

  confirmDelete(modalRef: any): void {
    if (this.selectedDeleteIndex !== null) {
      this.stepsList.splice(this.selectedDeleteIndex, 1);
    }
    modalRef.close();
  }


  onTextChange(obj: any, field: string, value: string): void {
    const result = limitWords(value || '', 250);
    obj[field] = result.trimmedText;
  }
}
