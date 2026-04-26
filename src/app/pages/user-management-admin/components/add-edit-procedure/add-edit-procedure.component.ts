import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcedureDto } from '../../../users-and-permissions-management/models/role.model';

@Component({
  selector: 'app-add-edit-procedure',
  templateUrl: './add-edit-procedure.component.html',
  styleUrls: ['./add-edit-procedure.component.scss']
})
export class AddEditProcedureComponent implements OnInit {
  @Input() procedure: ProcedureDto | null = null;
  @Input() mode: 'add' | 'edit' = 'add';

  procedureForm!: FormGroup;
  submitted = false;
  initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    if (this.mode === 'edit' && this.procedure) {
      this.patchForm();
    }

    // Store initial form value for change detection
    this.initialFormValue = this.procedureForm.value;
  }

  initForm(): void {
    this.procedureForm = this.fb.group({
      code: ['', [Validators.required]],
      nameAr: ['', [Validators.required]],
      nameEn: ['', [Validators.required]],
      descriptionAr: ['', [Validators.required]],
      descriptionEn: ['', [Validators.required]],
      isClientAccessible: [true],
      enabled: [true]
    });
  }

  patchForm(): void {
    if (this.procedure) {
      this.procedureForm.patchValue({
        code: this.procedure.code || '',
        nameAr: this.procedure.nameAr || '',
        nameEn: this.procedure.nameEn || '',
        descriptionAr: this.procedure.descriptionAr || '',
        descriptionEn: this.procedure.descriptionEn || '',
        isClientAccessible: this.procedure.isClientAccessible !== undefined ? this.procedure.isClientAccessible : true,
        enabled: this.procedure.enabled !== undefined ? this.procedure.enabled : true
      });

      // Update initial value after patching
      this.initialFormValue = this.procedureForm.value;
    }
  }

  get f() {
    return this.procedureForm.controls;
  }

  hasChanges(): boolean {
    return JSON.stringify(this.procedureForm.value) !== JSON.stringify(this.initialFormValue);
  }

  isSaveDisabled(): boolean {
    if (this.mode === 'edit') {
      return !this.hasChanges();
    }
    return false;
  }

  onSave(): void {
    this.submitted = true;

    if (this.procedureForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.procedureForm.controls).forEach(key => {
        this.procedureForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.procedureForm.value;
    this.activeModal.close(formValue);
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.procedureForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }
}
