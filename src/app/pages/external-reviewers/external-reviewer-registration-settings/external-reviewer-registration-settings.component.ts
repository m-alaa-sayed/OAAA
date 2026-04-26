import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {NgForm} from '@angular/forms';
import {ExternalReviewerSettingsService} from 'src/app/core/services/external-reviewer-settings.service';
import {Permission} from 'src/app/core/enum/permission';
import {ExternalReviewerSettingDto} from "../types/external-reviewer-setting.dto";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BaseModal} from 'src/app/shared/base-modal';
import {Audit} from 'src/app/core/models/audit';
import {ModalConfirmComponent} from 'src/app/shared/app-modal-confirm/modal-confirm.component';


@Component({
  selector: 'app-external-reviewer-register-settings',
  templateUrl: './external-reviewer-registration-settings.component.html',
  styleUrl: './external-reviewer-registration-settings.component.scss'
})
export class ExternalReviewerRegistrationSettingsComponent extends BaseModal implements OnInit {
  module!: string;
  dto: ExternalReviewerSettingDto = new ExternalReviewerSettingDto();
  auditLogs: Audit[] = [];
  paginatedAuditLogs: Audit[] = [];
  isViewMode = false;
  versionParam?: number;

  public Permission = Permission;
  permissionErRegistrationSettingsManage!: Permission;

  @ViewChild('auditModal') auditModalTemplate: any;
  @ViewChild('submitForm') submitForm?: NgForm;

  auditPage: number = 1;
  auditPageSize: number = 5;
  auditTotal: number =0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: ExternalReviewerSettingsService,
    private toastService: ToastService,
    public translate: TranslateService,
    public override modalService: NgbModal,
  ) {
    super(modalService);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.module = params.get('module') || '';

      this.permissionErRegistrationSettingsManage = 
        this.module === 'CSEQA' ? Permission.CSEQA_ER_registration_settings_MANAGE: 
        this.module === 'CHEQA' ? Permission.CHEQA_ER_registration_settings_MANAGE : 
        Permission.OQF_ER_registration_settings_MANAGE;

      this.versionParam = +params.get('version')!;
      this.isViewMode = this.router.url.includes('/view/');
      if (this.module) {
        if (this.isViewMode) {
          this.settingsService.findByVersionAndModule(this.module, this.versionParam).subscribe({
            next: data => {
              this.dto = data;
            },
            error: err => {
              this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false });
            }
          });
        } else {
          this.settingsService.getSettingsByModule(this.module).subscribe({
            next: data => {
              this.dto = data;

            },
            error: err => {
              this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), { classname: 'bg-danger text-white', autohide: false });
            }
          });
        }
      }
    });
  }

  getAuditLogs(): void {
    this.settingsService.getAuditLogs(this.module).subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.auditTotal = logs.length;
        this.paginateLogItems();
      },
      error: (err) => {
        console.error('Failed to load audit logs:', err);
      }
    });
  }

  paginateLogItems() {
    const start = (this.auditPage - 1) * this.auditPageSize;
    const end = start + this.auditPageSize;
    this.paginatedAuditLogs = this.auditLogs.slice(start, end);
  }

  onAuditPageChange(page: number) {
    this.auditPage = page;
    this.paginateLogItems();
  }

  save(): void {
    if (this.submitForm?.invalid) return;
    console.log(this.dto);

    this.settingsService.updateSettings(this.module, this.dto).subscribe({
      next: () => {
        this.toastService.show(
          this.translate.instant('PAGES.COMMON.MESSAGES.EDIT_SUCCESS'),
          { classname: 'bg-success text-white', delay: 3000 }
        );
      },
      error: (err) => {
        const msgKey = err?.error?.errorMessage || 'PAGES.COMMON.MESSAGES.UNKNOWN_ERROR';
        this.toastService.show(this.translate.instant(msgKey), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  cancel(): void {
    const modalRef = this.modalService.open(ModalConfirmComponent, { size: 'md', centered: true });
    modalRef.componentInstance.title = 'PAGES.COMMON.LABELS.CANCEL';
    modalRef.componentInstance.message = 'PAGES.COMMON.MESSAGES.CANCEL_CONFIRM_MESSAGE';
    
    modalRef.componentInstance.confirmEvent.subscribe(() => {
      this.router.navigate(['/jawda/dashboard']);
    });
  }

  openAuditPopup(): void {
    this.getAuditLogs();
    this.modalService.open(this.auditModalTemplate, { size: 'lg', centered: true });
  }
  openVersion(version: number | string): void {
    const url = `/jawda/external-reviewers/external-reviewer-register-settings/${this.module}/view/${version}`;
    window.open(url, '_blank');
  }

  // Prevent cursor jump by validating keystrokes instead of rewriting value
  onAcceptanceKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;

    // Allow navigation and control keys
    const controlKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (controlKeys.includes(key) || event.ctrlKey || event.metaKey) {
      return;
    }

    // Allow one decimal point only
    if (key === '.') {
      if (input.value.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    // Allow digits only
    if (!/^\d$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Simulate the new value to enforce max 2 decimals
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const newValue = input.value.slice(0, start) + key + input.value.slice(end);

    // Match: any digits, optional one dot, up to 2 decimals
    if (!/^\d*\.?\d{0,2}$/.test(newValue)) {
      event.preventDefault();
    }
  }
}
