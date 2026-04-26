import { Component, Input } from '@angular/core';
import { ProcedureUI, ProcedureActionUI, GroupDto } from '../../models/role.model';
import { FormMode } from '../../models/mode.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-role-procedures-table',
  templateUrl: './role-procedures-table.component.html',
  styleUrl: './role-procedures-table.component.scss'
})
export class RoleProceduresTableComponent {
  @Input() procedures: ProcedureUI[] = [];
  @Input() selectedGroup: GroupDto | null | undefined = null;
  @Input() mode: FormMode = 'readOnly';
  @Input() isSubmitted: boolean = false;

  constructor(public translate: TranslateService) { }

  getGroupName(): string {
    if (!this.selectedGroup) {
      return '';
    }
    return this.translate.currentLang === 'ar'
      ? (this.selectedGroup.nameAr || this.selectedGroup.code || '')
      : (this.selectedGroup.nameEn || this.selectedGroup.code || '');
  }

  toggleProcedure(procedure: ProcedureUI, event: any): void {
    procedure.enabled = event.target.checked;

    // Uncheck all actions when procedure is disabled
    if (!procedure.enabled) {
      procedure.permissions.forEach(permission => permission.checked = false);
    }
  }

  toggleAction(permission: ProcedureActionUI, event: any): void {
    permission.checked = event.target.checked;
  }

  isProcedureInvalid(procedure: ProcedureUI): boolean {
    return this.isSubmitted && procedure.enabled && !procedure.permissions.some(p => p.checked);
  }
}
