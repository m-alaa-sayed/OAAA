import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CriterionItem} from "../../types/acceptance-criteria/criterion-item";
import {CriterionItemOption} from "../../types/acceptance-criteria/criterion-item-option";
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';

@Component({
    selector: 'app-external-reviewers-acceptance-item-criteria-details',
    templateUrl: './external-reviewer-acceptance-item-criteria-details.component.html',
    styleUrls: ['./external-reviewer-acceptance-item-criteria-details.component.scss']
})
export class ExternalReviewerAcceptanceItemCriteriaDetailsComponent implements OnInit {

    dto: CriterionItem = this.getEmptyDto();

    @Input() title: string = '';
    @Input() criterionId?: number;
    @Input() subCriteriaId?: number;
    @Input() isEditMode: boolean = false;

    @Input() set inputDto(value: CriterionItem | null) {
        this.dto = value ?? this.getEmptyDto();
    }

    @Output() confirmEvent: EventEmitter<CriterionItem> = new EventEmitter<CriterionItem>();
    @Output() declineEvent: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("submitForm") submitForm?: NgForm;

    localOptions: CriterionItemOption[] = [];

    newOption: CriterionItemOption = { nameAr: '', nameEn: '', score: undefined };

    constructor(public activeModal: NgbActiveModal,
        public translate: TranslateService,
        private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.localOptions = this.dto.options.map(opt => ({ ...opt }));
    }

    get isActive(): boolean {
        return this.dto.status === 'ACTIVE';
    }

    set isActive(value: boolean) {
        this.dto.status = value ? 'ACTIVE' : 'IN_ACTIVE';
    }

    confirm(): void {
        if (this.submitForm?.invalid) return;

        if (this.checkOptionEmptyList()) {
            this.toastService.show(
                this.translate.instant('PAGES.EXTERNAL_REVIEWERS_ACCEPTANCE_CRITERIA_MANAGEMENT.MESSAGES.ADD_AT_LEAST_ONE_ITEM'),
                { classname: 'bg-danger text-white', autohide: false }
            );
            return;
        }

        this.dto.criterionId = this.criterionId;
        this.dto.subCriteriaId = this.subCriteriaId;
        if (this.dto.type === 'MULTIPLE_CHOICE') {
            this.dto.maxScore = null;
            this.dto.options = this.localOptions.map(opt => {
                const { editable, _backup, ...cleaned } = opt;
                return cleaned;
            });
        }else {
          this.dto.options = [];  
        }


        this.confirmEvent.emit(this.dto);
        this.activeModal.close();
    }

    private checkOptionEmptyList() {
        return this.dto.type == 'MULTIPLE_CHOICE' && (!this.localOptions || this.localOptions.length == 0)
    }

    decline(): void {
        this.declineEvent.emit();
        this.activeModal.close();        
    }

    enableEdit(index: number): void {
        const item = this.localOptions[index];
        item._backup = { ...item };
        item.editable = true;
    }

    saveEdit(index: number): void {
        const item = this.localOptions[index];
        item.editable = false;
        item._backup = undefined;
    }

    cancelEdit(index: number): void {
        const backup = this.localOptions[index]._backup;
        if (backup) {
            this.localOptions[index] = { ...backup };
        }
        this.localOptions[index].editable = false;
    }

    removeOption(index: number): void {
        this.localOptions.splice(index, 1);
    }

    addOption(): void {
        const existingIds = this.localOptions.map(o => o.id).filter((id): id is number => id !== undefined);
        const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        this.localOptions.push({ ...this.newOption, id: newId, editable: false });
        this.newOption = { nameAr: '', nameEn: '', score: undefined };
    }

    private getEmptyDto(): CriterionItem {
        return {
            id: undefined,
            criterionId: undefined,
            nameEn: '',
            nameAr: '',
            status: 'IN_ACTIVE',
            required: false,
            type: 'NUMERIC',
            maxScore: undefined,
            options: []
        };
    }
}
