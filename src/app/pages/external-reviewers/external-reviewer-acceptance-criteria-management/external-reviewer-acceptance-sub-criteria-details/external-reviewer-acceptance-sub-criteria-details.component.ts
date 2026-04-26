import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CriterionSubCriteria} from "../../types/acceptance-criteria/criterion-sub-criteria";

@Component({
    selector: 'app-external-reviewers-acceptance-sub-criteria-details',
    templateUrl: './external-reviewer-acceptance-sub-criteria-details.component.html',
    styleUrl: './external-reviewer-acceptance-sub-criteria-details.component.scss'
})
export class ExternalReviewerAcceptanceSubCriteriaDetailsComponent {

    dto: CriterionSubCriteria = this.getEmptyDto();

    @ViewChild("submitForm") submitForm?: NgForm;

    @Input() title: string = '';

    @Input() isEditMode: boolean = false;

    @Input() criterionId: number | undefined;

    @Input() set inputDto(value: CriterionSubCriteria | null) {
        this.dto = value ?? this.getEmptyDto();
    }

    @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() declineEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal) {
    }

    confirm(): void {
        if (this.submitForm?.submitted && this.submitForm?.invalid)
            return;
        this.dto.criterionId = this.criterionId
        this.confirmEvent.emit(this.dto);
        this.dto = this.getEmptyDto();
        this.activeModal.close();
    }

    decline(): void {
        this.dto = this.getEmptyDto();
        this.declineEvent.emit();
        this.activeModal.close()
    }

    get isActive(): boolean {
        return this.dto.status === 'ACTIVE';
    }

    set isActive(value: boolean) {
        this.dto.status = value ? 'ACTIVE' : 'IN_ACTIVE';
    }

    private getEmptyDto(): CriterionSubCriteria {
        return {
            id: undefined,
            criterionId: undefined,
            nameEn: '',
            nameAr: '',
            status: 'ACTIVE',
            items: []
        };
    }
}
