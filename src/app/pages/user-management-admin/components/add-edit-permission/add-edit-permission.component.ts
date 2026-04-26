import { Component, OnInit, Input, Output, EventEmitter, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionDto } from '../../../users-and-permissions-management/models/role.model';

@Component({
  selector: 'app-add-edit-permission',
  templateUrl: './add-edit-permission.component.html',
  styleUrls: ['./add-edit-permission.component.scss']
})
export class AddEditPermissionComponent implements OnInit {
  @Input() permission: PermissionDto | null = null;
  @Input() mode: 'add' | 'edit' = 'add';
  @Output() formSubmit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  permissionForm!: FormGroup;
  submitted = false;
  initialFormValue: any = null;

  constructor(
    private fb: FormBuilder,
    @Optional() public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    if (this.mode === 'edit' && this.permission) {
      this.patchForm();
    }

    // Store initial form value for change detection
    this.initialFormValue = this.permissionForm.value;
  }

  initForm(): void {
    this.permissionForm = this.fb.group({
      permissionCode: ['', [Validators.required]],
      permissionNameAr: ['', [Validators.required]],
      permissionNameEn: ['', [Validators.required]],
      permissionDescriptionAr: ['', [Validators.required]],
      permissionDescriptionEn: ['', [Validators.required]],
      isClientAccessible: [true],
      enabled: [true]
    });
  }

  patchForm(): void {
    if (this.permission) {
      this.permissionForm.patchValue({
        permissionCode: this.permission.permissionCode || '',
        permissionNameAr: this.permission.permissionNameAr || '',
        permissionNameEn: this.permission.permissionNameEn || '',
        permissionDescriptionAr: this.permission.permissionDescriptionAr || '',
        permissionDescriptionEn: this.permission.permissionDescriptionEn || '',
        isClientAccessible: this.permission.isClientAccessible !== undefined ? this.permission.isClientAccessible : true,
        enabled: this.permission.enabled !== undefined ? this.permission.enabled : true
      });

      // Update initial value after patching
      this.initialFormValue = this.permissionForm.value;
    }
  }

  get f() {
    return this.permissionForm.controls;
  }

  hasChanges(): boolean {
    return JSON.stringify(this.permissionForm.value) !== JSON.stringify(this.initialFormValue);
  }

  isSaveDisabled(): boolean {
    if (this.mode === 'edit') {
      return !this.hasChanges();
    }
    return false;
  }

  onSave(): void {
    this.submitted = true;

    if (this.permissionForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.permissionForm.controls).forEach(key => {
        this.permissionForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.permissionForm.value;
    
    // If used as a modal, close with result
    if (this.activeModal) {
      this.activeModal.close(formValue);
    } else {
      // If used as a regular component, emit the form data
      this.formSubmit.emit(formValue);
    }
  }

  onCancel(): void {
    // If used as a modal, dismiss
    if (this.activeModal) {
      this.activeModal.dismiss('cancel');
    } else {
      // If used as a regular component, emit cancel event
      this.cancel.emit();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.permissionForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }
}
