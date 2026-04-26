import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from 'src/app/core/services/common.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewersWithdrawalRequestInfo} from '../../types/external-reviewers-withdrawal-request-info';
import {ExternalReviewerWithdrawalService} from '../../services/external-reviewer-withdrawal.service';
import {ExternalReviewerAttachments} from '../../types/external-reviewer-attachments';
import {BaseModal} from 'src/app/shared/base-modal';
import {ExternalReviewersWithdrawalRequest} from '../../types/external-reviewers-withdrawal-request';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForm} from '@angular/forms';
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-external-reviewers-withdrawal-request-creation',
  templateUrl: './external-reviewers-withdrawal-request-creation.component.html',
  styleUrl: './external-reviewers-withdrawal-request-creation.component.scss'
})
export class ExternalReviewersWithdrawalRequestCreationComponent extends BaseModal implements OnInit {

  @ViewChild("submitForm") submitForm?: NgForm;

  externalReviewWithdrawInfo: ExternalReviewersWithdrawalRequestInfo = {} as ExternalReviewersWithdrawalRequestInfo;
  title: string = '';
  isSubmitted: boolean = false;



  constructor(
    private toastService: ToastService,
    public translate: TranslateService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    public override modalService: NgbModal,
    private externalReviewerWithdrawalService: ExternalReviewerWithdrawalService
  ) { super(modalService); }

  ngOnInit(): void {
    const module = this.route.snapshot.paramMap.get('module') || '';
    const serviceCode = history.state.serviceCode;
    this.externalReviewWithdrawInfo.module = module;
    this.externalReviewWithdrawInfo.serviceCode = serviceCode;
    this.pageTitle();
  }

  pageTitle() {
    this.title = this.translate.instant('PAGES.EXTERNAL_REVIEWERS_WITHDRAW.TITLE.' + this.externalReviewWithdrawInfo.module);
  }

  addAttchment(attachmentObject: ExternalReviewerAttachments) {
    if (!this.externalReviewWithdrawInfo.externalReviewWithdrawAttachments) {
      this.externalReviewWithdrawInfo.externalReviewWithdrawAttachments = []
    }
    this.externalReviewWithdrawInfo.externalReviewWithdrawAttachments.push(attachmentObject);
  }

  removeAttchment(index: number) {
    this.externalReviewWithdrawInfo.externalReviewWithdrawAttachments?.splice(index, 1);
  }


  submit() {
    this.close();
    const externalReviewersWithdrawalRequest: ExternalReviewersWithdrawalRequest = {
      externalReviewWithdrawInfo: this.externalReviewWithdrawInfo
    }
    this.externalReviewerWithdrawalService.createRequest(this.externalReviewWithdrawInfo.serviceCode, externalReviewersWithdrawalRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: response.data, action: 'SUBMIT' }
        });
      },
      error: (err) => {
        const msgKey = err?.error?.errorMessage || 'PAGES.COMMON.MESSAGES.UNKNOWN_ERROR';
        this.toastService.show(this.translate.instant(msgKey), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  validateForm(content: any) {
    this.isSubmitted = true;
    if (this.submitForm?.invalid || !this.externalReviewWithdrawInfo.withdrawJustification.trim()) {
      scrollTo(0, 0);
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), { classname: 'bg-danger text-white', autohide: false });
      return;
    }
    this.open(content);
  }


  onTextChange(): void {
    const result = limitWords(this.externalReviewWithdrawInfo.withdrawJustification || '', 250);
    this.externalReviewWithdrawInfo.withdrawJustification = result.trimmedText;
  }
}
