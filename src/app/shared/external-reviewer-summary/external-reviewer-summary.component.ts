import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { ExternalReviewerManagementService } from 'src/app/pages/external-reviewers/services/external-reviewer-management.service';

@Component({
  selector: 'external-reviewer-summary',
  templateUrl: './external-reviewer-summary.component.html',
  styleUrl: './external-reviewer-summary.component.scss'
})
export class ExternalReviewerSummaryComponent implements OnInit {
  @Input() externalReviewerId!: any;
  @Input() title: string = 'PAGES.EXTERNAL_REVIEWERS_WITHDRAW.LABELS.ER_SUMMARY';
  externalReviewer: any;
  showData: boolean = false;

  constructor(
    public translate: TranslateService,
    private externalReviewerManagementService: ExternalReviewerManagementService,
    private toastService: ToastService, private router: Router
  ) {

  }
  ngOnInit(): void {
    this.getExternalReviewerById();
  }

  isEmpty(value: any): boolean {
    return !value || (Array.isArray(value) && value.length === 0);
  }

  getExternalReviewerById() {
    this.externalReviewerManagementService.getExternalReviewerById(Number(this.externalReviewerId)).subscribe({
      next: (response) => {
        this.externalReviewer = response.data;
        this.showData = true;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }

  openDetails() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/jawda/external-reviewers/external-reviewer-details/', this.externalReviewerId])
    );
    window.open(url, '_blank');
  }
}
