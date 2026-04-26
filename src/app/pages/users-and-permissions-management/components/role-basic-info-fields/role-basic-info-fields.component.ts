import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RoleDto, GroupDto, RoleTypeDto } from '../../models/role.model';
import { FormMode } from '../../models/mode.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-role-basic-info-fields',
  templateUrl: './role-basic-info-fields.component.html',
  styleUrl: './role-basic-info-fields.component.scss'
})
export class RoleBasicInfoFieldsComponent {
  @Input() roleData: RoleDto | null = null;
  @Input() mode: FormMode = 'readOnly';
  @Input() groups: GroupDto[] = [];
  @Input() roleTypes: RoleTypeDto[] = [];
  @Input() isSubmitting: boolean = false; // For validation UI state
  @Output() groupChange = new EventEmitter<GroupDto | null>();
  
  lang = this.translate.currentLang;
  arabicPattern = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s]+$/;
  englishPattern = /^[a-zA-Z0-9\s]+$/;

  constructor(public translate: TranslateService) { }

  isFieldDisabled(fieldName: string): boolean {
    if (this.mode === 'readOnly') {
      return true;
    }
    if (this.mode === 'add') {
      return fieldName === 'code';
    }
    if (this.mode === 'edit') {
      return ['code', 'roleType', 'groupe'].includes(fieldName);
    }
    return false;
  }

  compareGroups(g1: GroupDto | null, g2: GroupDto | null): boolean {
    return g1?.id === g2?.id;
  }

  onGroupSelectionChange(): void {
    this.groupChange.emit(this.roleData?.group);
  }

  isFieldInvalid(fieldName: string, fieldModel: any): boolean {
    if (!this.isSubmitting || !this.roleData) return false;

    if (fieldModel.invalid) return true;

    if (fieldName === 'roleNameAr' && this.roleData.roleNameAr) {
      return !this.arabicPattern.test(this.roleData.roleNameAr);
    }

    if (fieldName === 'roleNameEn' && this.roleData.roleNameEn) {
      return !this.englishPattern.test(this.roleData.roleNameEn);
    }

    return false;
  }
}
