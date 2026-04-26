import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {CriterionVersion} from "../../types/acceptance-criteria/criterion-version";

@Component({
    selector: 'app-external-reviewers-acceptance-main-criteria-details',
    templateUrl: './external-reviewer-acceptance-main-criteria-details.component.html',
    styleUrl: './external-reviewer-acceptance-main-criteria-details.component.scss'
})
export class ExternalReviewerAcceptanceMainCriteriaDetailsComponent {

    dto: CriterionVersion = this.getEmptyDto();

    @ViewChild("submitForm") submitForm?: NgForm;

    @Input() title: string = '';
    @Input() criterionId?: number;

    @Input() set inputDto(value: CriterionVersion | null) {
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

    private getEmptyDto(): CriterionVersion {
        return {
            id: undefined,
            criterionId: undefined,
            version: undefined,
            nameEn: '',
            nameAr: '',
            status: 'ACTIVE',
            versionNotes: '',
            subCriteriaList: [],
            isPublished: false
        };
    }

    get isActive(): boolean {
        return this.dto.status === 'ACTIVE';
    }

    set isActive(value: boolean) {
        this.dto.status = value ? 'ACTIVE' : 'IN_ACTIVE';
    }
}
