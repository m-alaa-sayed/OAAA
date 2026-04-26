import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RequestHistory } from '../types/request-history';
import {LanguageUtil} from "../../core/util/language.util";
import { AuthService } from '../../core/services/auth.service';
import { UserClaim } from '../../core/models/user-claim';
import { Permission } from '../../core/enum/permission';

@Component({
  selector: 'follow-up-request',
  templateUrl: './follow-up-request.component.html',
  styleUrls: ['./follow-up-request.component.scss']
})
export class FollowUpRequestComponent implements OnInit {
  @Input() requestHistoryList: RequestHistory[] = [];
  @Input() module?: any;

  pageSize: number = 5;
  currentPage: number = 1;
  pagedFollowUpList: any[] = [];
  currentUserClaim: UserClaim | null = null;

  constructor(
    public translate: TranslateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserClaim = this.authService.getUserClaim();
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedFollowUpList = this.requestHistoryList.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  convertTZ(date: any) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
  }

  /**
   * Check if current user has admin permissions
   * We consider a user as admin if they have any of the management permissions
   */
  isCurrentUserAdmin(): boolean {
    if (!this.currentUserClaim?.permissions) {
      return false;
    }
    
    const adminPermissions = [
      Permission.MANAGE_SERVICE,
      Permission.CHEQA_ER_Acceptance_CRITERIA_MANAGE,
      Permission.CSEQA_ER_Acceptance_CRITERIA_MANAGE,
      Permission.OQF_ER_Acceptance_CRITERIA_MANAGE,
      Permission.CHEQA_ER_registration_settings_MANAGE,
      Permission.CSEQA_ER_registration_settings_MANAGE,
      Permission.OQF_ER_registration_settings_MANAGE,
      // Add other admin-level permissions as needed
    ];
    
    return adminPermissions.some(permission => 
      this.currentUserClaim!.permissions.includes(permission)
    );
  }

  /**
   * Check if the row user is the same as current user
   */
  isCurrentUser(rowUserId: number | undefined): boolean {
    return this.currentUserClaim?.userId === rowUserId;
  }

  /**
   * Determine whether to show job title instead of full name
   * Show job title when: current user is NOT admin AND row user is NOT current user
   */
  shouldShowJobTitle(rowUserId: number | undefined): boolean {
    if (this.module == 'CSEQA') {
      return !this.isCurrentUserAdmin() && !this.isCurrentUser(rowUserId);
    }
    return false;
  }

  protected readonly LanguageUtil = LanguageUtil;
}
