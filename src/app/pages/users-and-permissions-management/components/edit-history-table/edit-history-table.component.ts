import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RolesAuditEventDto } from '../../models/role.model';
import { CommonUtil } from 'src/app/core/util/common-util';

@Component({
  selector: 'app-edit-history-table',
  templateUrl: './edit-history-table.component.html',
  styleUrl: './edit-history-table.component.scss'
})
export class EditHistoryTableComponent implements OnChanges {
  @Input() historyData: RolesAuditEventDto[] = [];

  pageSize: number = 5;
  currentPage: number = 1;
  pagedHistoryData: RolesAuditEventDto[] = [];

  constructor(public translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['historyData']) {
      this.updatePagination();
    }
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedHistoryData = this.historyData.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getOperationTypeLabel(operationType?: string): string {
    return CommonUtil.getOperationTypeLabel(operationType);
  }

  getCurrentLangUserName(history: RolesAuditEventDto): string {
    return this.translate.currentLang === 'ar' 
      ? (history.userFullNameAr || '-') 
      : (history.userFullNameEn || '-');
  }

  formatDateTime(dateTime?: string): string {
    if (!dateTime) return '-';
    try {
      const date = new Date(dateTime);
      // Force English formatting for consistent LTR display
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      // Date on left, time on right with clear separation
      return `${day}/${month}/${year}   ${displayHours}:${minutes} ${ampm}`;
    } catch (e) {
      return dateTime;
    }
  }

  getDateTimeDirection(): string {
    return 'ltr';
  }

  getDateTimeAlignment(): string {
    return this.translate.currentLang === 'ar' ? 'text-end' : 'text-start';
  }
}
