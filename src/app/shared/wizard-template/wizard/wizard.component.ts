import {Component, Input} from '@angular/core';
import {StepItem} from "../step-item";
import {BehaviorSubject} from "rxjs";
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'oaaaqa-management-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.css']
})
export class WizardComponent {
    @Input() steps = [] as StepItem[];
    @Input() title: string = "";
    currentStepSubject: BehaviorSubject<number> = new BehaviorSubject(1);
    currentStep: number = 1;
    @Input() clickableSteps: number[] = [];

    constructor(public translate: TranslateService) {
        this.currentStepSubject.subscribe(v => {
            this.currentStep = v;
        })
    }

    getComponentInputs(index: number) {
        const o1 = {currentStepSubject: this.currentStepSubject, steps: this.steps};
        const inputs: any = {};
        if (this.steps[index].inputs) {
            this.steps[index].inputs?.forEach((value, key) => {
                inputs[key] = value;
            });
        }
        return {...o1, ...inputs};
    }

    onStepClick(targetStep: number) {
        if (this.clickableSteps.includes(targetStep)) {
            this.currentStepSubject.next(targetStep);
        }
    }
}
