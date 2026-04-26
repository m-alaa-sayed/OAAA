import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-modal-confirm',
    templateUrl: './modal-confirm.component.html',
    styleUrl: './modal-confirm.component.scss'
})
export class ModalConfirmComponent implements AfterViewInit {

    @Input() title: string = '';
    @Input() message: string = '';
    @Input() isAlert: boolean = false; // New property to determine if it's an alert or confirm modal
    @Input() alertType: 'success' | 'error' | 'warning' | 'info' = 'info'; // Type of alert
    @Input() showNotes: boolean = false; // Whether to show notes textarea
    @Input() notesRequired: boolean = false; // Whether notes are required
    @Input() notesLabel: string = 'PAGES.COMMON.LABELS.JUSTIFICATIONS'; // Label for notes field
    @Input() notesPlaceholder: string = 'PAGES.COMMON.LABELS.DESCRIPTION_HINT'; // Placeholder for notes
    @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() declineEvent: EventEmitter<any> = new EventEmitter<any>();
    
    notes: string = '';
    notesTouched: boolean = false;
    submitAttempted: boolean = false;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal) {
    }

    // Static method to open alert modal
    static openAlert(modalService: NgbModal, message: string, title: string = '', alertType: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
        const modalRef = modalService.open(ModalConfirmComponent, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.isAlert = true;
        modalRef.componentInstance.alertType = alertType;
    }

    // Static method to open confirm modal
    static openConfirm(modalService: NgbModal, message: string, title: string = ''): Promise<boolean> {
        const modalRef = modalService.open(ModalConfirmComponent, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
            size: 'sm'
        });
        
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.isAlert = false;

        return new Promise((resolve) => {
            modalRef.componentInstance.confirmEvent.subscribe(() => {
                resolve(true);
            });
            modalRef.componentInstance.declineEvent.subscribe(() => {
                resolve(false);
            });
            modalRef.result.catch(() => resolve(false));
        });
    }

    // Static method to open confirm modal with notes
    static openConfirmWithNotes(
        modalService: NgbModal, 
        message: string, 
        title: string = '',
        notesRequired: boolean = true,
        notesLabel?: string,
        notesPlaceholder?: string
    ): Promise<{confirmed: boolean, notes: string}> {
        const modalRef = modalService.open(ModalConfirmComponent, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
            size: 'md'
        });
        
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.isAlert = false;
        modalRef.componentInstance.showNotes = true;
        modalRef.componentInstance.notesRequired = notesRequired;
        if (notesLabel) modalRef.componentInstance.notesLabel = notesLabel;
        if (notesPlaceholder) modalRef.componentInstance.notesPlaceholder = notesPlaceholder;

        return new Promise((resolve) => {
            modalRef.componentInstance.confirmEvent.subscribe((notes: string) => {
                resolve({confirmed: true, notes});
            });
            modalRef.componentInstance.declineEvent.subscribe(() => {
                resolve({confirmed: false, notes: ''});
            });
            modalRef.result.catch(() => resolve({confirmed: false, notes: ''}));
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop') as HTMLElement;
            if (backdrop) {
                backdrop.classList.add('show');
                backdrop.style.display = 'block';
                backdrop.style.opacity = '0.5';
                backdrop.style.zIndex = '1040';
            }
            const modal = document.querySelector('.modal') as HTMLElement;
            if (modal) {
                modal.style.zIndex = '1050';
            }
        }, 10);
    }

    confirm(): void {
        this.submitAttempted = true;
        
        if (this.showNotes && this.notesRequired && !this.notes?.trim()) {
            return; // Prevent confirmation if notes are required but empty
        }
        this.confirmEvent.emit(this.showNotes ? this.notes : undefined);
        this.activeModal.dismiss()
    }

    isConfirmDisabled(): boolean {
        return this.showNotes && this.notesRequired && !this.notes?.trim();
    }

    decline(): void {
        this.declineEvent.emit();
        this.activeModal.dismiss()
    }

    // Method for alert modal (single OK button)
    closeAlert(): void {
        this.activeModal.dismiss();
    }

    // Get icon based on alert type
    getAlertIcon(): string {
        switch (this.alertType) {
            case 'success':
                return 'https://cdn.lordicon.com/oqdmuxru.json'; // Success icon
            case 'error':
                return 'https://cdn.lordicon.com/akqsdstj.json'; // Error icon
            case 'warning':
                return 'https://cdn.lordicon.com/tdrtiskw.json'; // Warning icon
            default:
                return 'https://cdn.lordicon.com/msoeawqm.json'; // Info icon
        }
    }

    // Get icon colors based on alert type
    getAlertColors(): string {
        switch (this.alertType) {
            case 'success':
                return 'primary:#28a745,secondary:#ffffff';
            case 'error':
                return 'primary:#dc3545,secondary:#ffffff';
            case 'warning':
                return 'primary:#ffc107,secondary:#000000';
            default:
                return 'primary:#17a2b8,secondary:#ffffff';
        }
    }
}
