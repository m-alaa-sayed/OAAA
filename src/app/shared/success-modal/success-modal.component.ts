import {AfterViewInit, Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-success-modal',
    templateUrl: './success-modal.component.html',
    styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent implements AfterViewInit {

    @Input() successMessage: string = '';

    constructor(public activeModal: NgbActiveModal) {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            // Reapply modal styles after Lordicon may have disrupted them
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
}
