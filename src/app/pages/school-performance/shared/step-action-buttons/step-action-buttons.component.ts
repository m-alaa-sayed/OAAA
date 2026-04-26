import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'step-action-buttons',
  templateUrl: './step-action-buttons.component.html',
  styleUrl: './step-action-buttons.component.scss'
})
export class StepActionButtonsComponent {

  @Input() showNextBtn = true;
  @Input() showPreviousBtn = true;
  @Input() showSubmitBtn = true;
  @Input() showSaveBtn = true;

  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();


  constructor(public translate: TranslateService) { }
}
