import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from "@angular/router";

@Component({
    selector: 'page-title',
    templateUrl: './page-title.component.html',
    styleUrl: './page-title.component.scss'
})
export class PageTitleComponent {
    @Input() title: string | undefined;
    @Input() backgroundImage: string | undefined;
    @Input() breadcrumbItems: { active?: boolean; label?: string; link?: string, state?: any; }[] = [];

    constructor(
        public translate: TranslateService,
        private router: Router) {
    }

    navigateWithState(item: any) {
        if (!item?.link) return;
        const navigationExtras = item.state ? {state: item.state} : {};
        this.router.navigate([item.link], navigationExtras);
    }
}
