import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from 'src/app/core/constants/app-constants';
import { ToastService } from 'src/app/core/services/toast-service';
import { UsersManagementService } from 'src/app/core/services/users-management.service';
import { UserBasicInfoData } from '../../components/user-basic-info/user-basic-info.component';
import { UserDetailsDto } from 'src/app/core/models/user-details.model';
import { ModalConfirmComponent } from 'src/app/shared/app-modal-confirm/modal-confirm.component';
import { CommonUtil } from 'src/app/core/util/common-util';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordObj: any = {};
  userId: string = '';
  breadcrumbItems: any[] = [];
  historyData: any[] = [];
  userFullData: UserDetailsDto | undefined;

  @ViewChild("changePasswordForm") changePasswordForm?: NgForm;

  confirmField: boolean = false;
  newPasswordField: boolean = false;
  PASSWORD_PATTERN = AppConstants.PATTERNS.PASSWORD;
  isChangePasswordSubmitting: boolean = false;
  returnTab: number = 1; // Default to users tab
  isPasswordChanged: boolean = false; // Track if password was successfully changed

  constructor(
    public translate: TranslateService,
    private usersManagementService: UsersManagementService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || '';

      if (params['returnTab']) {
        this.returnTab = +params['returnTab'];
      }
      
      this.loadUserData();
    });

    this.breadcrumbItems = [
      { label: this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.LABELS.PERMISSIONS_MANAGEMENT'), link: '/jawda/users-permissions-management' },
      { label: this.translate.instant('PAGES.LOGIN.LABELS.CHANGE_PASSWORD'), active: true }
    ];
  }

  loadUserData(): void {
    if (!this.userId) {
      return;
    }

    this.usersManagementService.getUserById(this.userId).subscribe({
      next: (response) => {
        const user = response?.data;
        if (!user) {
          this.toastService.show(
            this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
            { classname: 'bg-danger text-white', autohide: false }
          );
          return;
        }
        this.userFullData = user;

        this.loadPasswordChangeHistory();
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.ERROR_LOADING_DATA'),
          { classname: 'bg-danger text-white', autohide: false }
        );
      }
    });
  }

  loadPasswordChangeHistory(): void {
    this.usersManagementService.getPasswordChangeHistory(this.userId).subscribe({
      next: (historyData) => {
        this.historyData = this.mapHistoryData(historyData);
      },
      error: (error) => {
        this.historyData = [];
      }
    });
  }

  private mapHistoryData(events: any[] = []): any[] {
    return events.map((event: any) => {
      return {
        operationType: event.operationTypeCode || event.operationType || event.actionType || event.eventType || '',
        userFullNameAr: event.actorUserFullNameAr || event.userFullNameAr || event.employeeName || event.createdBy || '-',
        userFullNameEn: event.actorUserFullNameEn || event.userFullNameEn || event.employeeName || event.createdBy || '-',
        createdOn: event.createdOn || event.timestamp || event.createdAt || '',
        notes: event.notes || event.description || ''
      };
    });
  }

  getOperationTypeLabel(operationType: string): string {
    return CommonUtil.getOperationTypeLabel(operationType);
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '-';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  changePassword(): void {
    this.isChangePasswordSubmitting = true;
    if (this.changePasswordForm?.invalid) {
      scrollTo(0, 0);
      return;
    }

    if (!this.passwordPatternValid() || !this.passwordsMatch()) {
      return;
    }

    // Show confirmation modal with notes
    const message = this.translate.instant('PAGES.PERMISSIONS_MANAGEMENT.MESSAGES.CONFIRM_PASSWORD_CHANGE');
    const title = this.translate.instant('PAGES.LOGIN.LABELS.CHANGE_PASSWORD');

    ModalConfirmComponent.openConfirmWithNotes(this.modalService, message, title, true).then((result) => {
      if (result.confirmed) {
        const passwordData = {
          userId: this.userId,
          newPassword: this.changePasswordObj.newPassword,
          confirmPassword: this.changePasswordObj.confirmPassword
        };

        this.usersManagementService.adminChangeUsersPassword(passwordData, result.notes).subscribe({
          next: (res) => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.PASSWORD_CHANGED_SUCCESS'),
              { classname: 'bg-success text-white', delay: 3000 }
            );
            // Stay on the same page, disable form, and hide button
            this.isPasswordChanged = true;
            this.isChangePasswordSubmitting = false;
            this.changePasswordForm?.form.disable();
            
            setTimeout(() => {
              this.cancel();
            }, 1500);
          },
          error: (error) => {
            this.toastService.show(
              this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
              { classname: 'bg-danger text-white', autohide: false }
            );
            this.isChangePasswordSubmitting = false;
          }
        });
      } else {
        this.isChangePasswordSubmitting = false;
      }
    }).catch(() => {
      this.isChangePasswordSubmitting = false;
    });
  }

  toggleNewPasswordField(): void {
    this.newPasswordField = !this.newPasswordField;
  }

  toggleconfirmField(): void {
    this.confirmField = !this.confirmField;
  }

  passwordPatternValid(): boolean {
    const regex = new RegExp(this.PASSWORD_PATTERN);
    return regex.test(this.changePasswordObj.newPassword || '');
  }

  passwordsMatch(): boolean {
    return this.changePasswordObj.newPassword === this.changePasswordObj.confirmPassword;
  }

  cancel(): void {
    this.router.navigate(['/jawda/users-permissions-management'], {
      queryParams: { returnTab: this.returnTab }
    });
  }
}
