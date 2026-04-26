import {Type} from '@angular/core';
import {BaseTabComponent} from './base-tab.component';

export interface TabItem {
  labelAr: string;
  labelEn: string;
  component: Type<BaseTabComponent>;
  inputs?: Map<string, any>;
}
