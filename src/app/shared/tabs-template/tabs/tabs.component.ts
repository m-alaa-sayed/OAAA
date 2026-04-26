import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageUtil } from 'src/app/core/util/language.util';
import { TabItem } from '../tab-item';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
@Input() tabs = [] as TabItem[];
  currentTabSubject: BehaviorSubject<number> = new BehaviorSubject(1);
  @Input() currentTab = 1;
  protected readonly LanguageUtil = LanguageUtil;

  constructor() {
    this.currentTabSubject.subscribe(v => {
      this.currentTab = v;
    });
  }

  navigateToTab(tabIndex: number) {
    this.currentTabSubject.next(tabIndex);
  }

  getComponentInputs(index: number) {
    const o1 = {currentTabSubject: this.currentTabSubject, tabs: this.tabs};
    const inputs : any = {};
    if (this.tabs[index].inputs) {
      this.tabs[index].inputs?.forEach((value, key) => {
        inputs[key] = value;
      });
    }
    return {...o1, ...inputs};
  }
}
