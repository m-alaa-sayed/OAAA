import { BaseWizardService } from "./base-wizard.service";
import { BehaviorSubject } from "rxjs";
import { Component, Input } from "@angular/core";
import { StepItem } from "./step-item";
import { Router } from "@angular/router";

@Component({
  template: ''
})
export abstract class BaseStepComponent {
  @Input() private currentStepSubject!: BehaviorSubject<number>;
  @Input() private steps = [] as StepItem[]

  protected constructor(protected wizardService: BaseWizardService, protected router: Router) { }

  next() {
    const currentValue = this.currentStepSubject.getValue();

    if (currentValue < this.steps.length) {
      window.scroll(0, 0);
      this.currentStepSubject.next(currentValue + 1);
    }
  }

  previous() {
    const currentValue = this.currentStepSubject.getValue();

    if (currentValue > 1) {
      window.scroll(0, 0);
      this.currentStepSubject.next(currentValue - 1);
    }
  }

  cancel() {
    void this.router.navigate([this.wizardService.getCancelUrl()])
  }

}
