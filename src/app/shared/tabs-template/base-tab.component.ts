import {Component, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TabItem} from "./tab-item";

@Component({
  template: ''
})
export abstract class BaseTabComponent {
  @Input() private currentTabSubject!: BehaviorSubject<number>;
  @Input() private tabs = [] as TabItem[];

  next() {
    const currentValue = this.currentTabSubject.getValue();

    if (currentValue < this.tabs.length)
      this.currentTabSubject.next(currentValue + 1);
  }

  previous() {
    const currentValue = this.currentTabSubject.getValue();

    if (currentValue > 1)
      this.currentTabSubject.next(currentValue - 1);
  }
}
