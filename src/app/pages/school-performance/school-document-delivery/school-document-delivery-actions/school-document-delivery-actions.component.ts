import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseModal} from "../../../../shared/base-modal";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from "../../../../core/services/toast-service";
import {TranslateService} from "@ngx-translate/core";
import {SchoolDocumentDelivery} from "../../types/school-document-delivery";
import {SchoolDocumentDeliveryService} from "../../service/school-document-delivery.service";

@Component({
    selector: 'app-school-document-delivery-actions',
    templateUrl: './school-document-delivery-actions.component.html',
    styleUrl: './school-document-delivery-actions.component.scss'
})
export class SchoolDocumentDeliveryActionsComponent extends BaseModal {

    action: string | undefined;
    submitted = false;
    comment!: string;
    stepCode!: string;

    @Input() taskId!: any;
    @Input() requestObject!: any;
    @Input() isTlUser = false;
    @Input() isSchoolUser = false;
    @Input() requestInfo: SchoolDocumentDelivery = {} as SchoolDocumentDelivery;

    @Output() actionEventEmitter = new EventEmitter<any>();
    @Output() showErrorAndHideSpinner = new EventEmitter<boolean>();

    constructor(public route: ActivatedRoute,
                public override modalService: NgbModal,
                public toastService: ToastService,
                private schoolDocumentDeliveryService: SchoolDocumentDeliveryService,
                public translate: TranslateService,
                public router: Router
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        this.stepCode = this.requestObject.serviceStep.stepCode;
    }

    setAction(action: any, content: any) {
        this.action = action;
        if (this.action == 'SAVE'){
            this.sendAction();
            return;
        }
        if (this.handleSpecialErrorCases(action)) {
            this.comment = "";
            this.open(content);
        }
    }

    closePopup() {
        (this.comment = ''), (this.submitted = false);
        this.close();
    }

    sendAction() {
        if (!this.comment && (this.action == 'RETURN_FOR_EDIT')) {
            this.submitted = true;
        } else {
            this.close();
            this.actionEventEmitter.emit({comment: this.comment, action: this.action})
        }
    }

    returnToList() {
        this.close();
        this.router.navigate(['/jawda/service-management/service-catalogue-list']);
    }

    handleSpecialErrorCases(event: any): boolean {
        if (!this.schoolDocumentDeliveryService.validateDocumentItems(this.requestInfo, this.isTlUser, this.isSchoolUser)) {
            this.showErrorAndHideSpinner.emit(false);
            return false
        }
        return true;
    }

}
