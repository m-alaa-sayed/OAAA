import {BaseStepComponent} from "./base-step.component";
import {Type} from "@angular/core";

export interface StepItem {
  labelAr: string;
  labelEn: string;
  component: Type<BaseStepComponent>
  inputs?: Map<string, any>;
}
