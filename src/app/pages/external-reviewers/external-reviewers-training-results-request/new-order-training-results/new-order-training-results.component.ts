import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ExternalReviewersRegistrationRequest} from '../../types/external-reviewers-registration-request';
import {getServiceCodeByModule} from '../../../../shared/utils/module-service-map';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewersTrainingService} from '../../services/external-reviewers-training.service';
import {BaseModal} from 'src/app/shared/base-modal';
import {ExternalReviewerTrainingResult} from '../../types/ExternalReviewerTrainingResult';
import {ExternalReviewerTrainingResultCreate} from '../../types/external-reviewer-training-result-create';
import {RequestAttachment} from 'src/app/shared/types/request-attachment';
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-new-order-training-results',
  templateUrl: './new-order-training-results.component.html',
  styleUrl: './new-order-training-results.component.scss'
})
export class NewOrderTrainingResultsComponent extends BaseModal implements OnInit {

  externalReviewersRegistrationRequestList: ExternalReviewersRegistrationRequest[] = [];
  filteredExternalReviewersRegistrationRequestList: ExternalReviewersRegistrationRequest[] = [];
  externalReviewerTrainingResultList: ExternalReviewerTrainingResult[] = [];

  externalReviewerTrainingResultCreate: ExternalReviewerTrainingResultCreate = {} as ExternalReviewerTrainingResultCreate;


  serviceCode: string = "";
  module: string = "";

  columns: any[] = [];
  actions: any;
  showGridTable: boolean = false;



  // Notes section
  generalNotes: string = '';
  //attachments
  constructor(
    public override modalService: NgbModal,
    public translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private externalReviewersTrainingService: ExternalReviewersTrainingService
  ) {
    super(modalService);
    this.module = this.route.snapshot.paramMap.get('module') || '';
    this.serviceCode = getServiceCodeByModule(this.module) || "";
  }

  ngOnInit(): void {
    // this.prepareGridHeaderCols();
    this.getEligibleExternalReviewers();
  }


  // get elligable data 
  private getEligibleExternalReviewers() {
    this.externalReviewersTrainingService.getEligibleExternalReviewers(this.serviceCode).subscribe({
      next: (response) => {
        this.externalReviewersRegistrationRequestList = response.data;
        this.showGridTable = true;
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  updateErtraninigResultList(completeRowData: ExternalReviewerTrainingResult) {
    this.externalReviewerTrainingResultList = [
      ...(this.externalReviewerTrainingResultList || []),
      completeRowData
    ];

    this.filteredExternalReviewersRegistrationRequestList =
      this.externalReviewersRegistrationRequestList?.filter(request =>
        !this.externalReviewerTrainingResultList?.some(result =>
          result.externalReviewersRegistrationRequestInfoId === request.externalReviewersRegistrationRequestInfo?.id
        )
      );
  }


  deleteTrainingResult(deletedRowData: ExternalReviewerTrainingResult) {
    this.externalReviewerTrainingResultList = this.externalReviewerTrainingResultList.filter(
      item => item.externalReviewersRegistrationRequestInfoId != deletedRowData.externalReviewersRegistrationRequestInfoId
    );

    this.filteredExternalReviewersRegistrationRequestList =
      this.externalReviewersRegistrationRequestList?.filter(request =>
        !this.externalReviewerTrainingResultList?.some(result =>
          result.externalReviewersRegistrationRequestInfoId === request.externalReviewersRegistrationRequestInfo?.id
        )
      );

    // this.filteredExternalReviewersRegistrationRequestList = this.externalReviewersRegistrationRequestList.filter(
    //   item => item.externalReviewersRegistrationRequestInfo?.id == deletedRowData.externalReviewersRegistrationRequestInfoId
    // );


  }


  cancel(): void {
    this.router.navigate(['/jawda/external-reviewers-training-results/training-results']);
  }


  validateForm(content: any) {
    // this.isSubmitting = true;
    // if (this.submitForm?.invalid) {
    //   scrollTo(0, 0);
    //   return;
    // }
    this.open(content);
  }


  createRequest() {
    this.externalReviewerTrainingResultCreate.externalReviewerTrainingResultDtoList = this.externalReviewerTrainingResultList;
    this.close();
    this.externalReviewersTrainingService.createRequest(this.serviceCode, this.externalReviewerTrainingResultCreate).subscribe({
      next: (response) => {
        this.router.navigate(['/jawda/success-page'], {
          state: { requestApplicationNo: response.data, action: 'SUBMIT' }
        });
      },
      error: (error) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
      }
    });
  }


  addAttchment(attachmentObject: RequestAttachment) {
    if (!this.externalReviewerTrainingResultCreate.requestAttachmentList) {
      this.externalReviewerTrainingResultCreate.requestAttachmentList = []
    }
    this.externalReviewerTrainingResultCreate.requestAttachmentList.push(attachmentObject);
  }



  removeAttchment(index: number) {
    this.externalReviewerTrainingResultCreate.requestAttachmentList?.splice(index, 1);
  }

  onTextChange(): void {
    const result = limitWords(this.externalReviewerTrainingResultCreate.requestNotes || '', 250);
    this.externalReviewerTrainingResultCreate.requestNotes = result.trimmedText;
  }
}
