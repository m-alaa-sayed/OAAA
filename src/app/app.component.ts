import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SessionTimeoutWarningComponent} from './shared/session-timeout-warning/session-timeout-warning.component';
import {IdleTimeoutService} from './core/services/idle-timeout.service';
import {NavigationEnd, NavigationStart, Router} from "@angular/router";
import {LanguageService} from './core/services/language.service';
import {TranslateService} from '@ngx-translate/core';
import {filter, finalize} from 'rxjs';
import {ToastService} from './core/services/toast-service';
import {AuthService} from './core/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

    @ViewChild('timeoutModal')
    timeoutModal!: SessionTimeoutWarningComponent;

    constructor(
        private idleTimeoutService: IdleTimeoutService,
        private router: Router,
        private languageService: LanguageService,
        private translate: TranslateService,
        private toastService: ToastService,
        private authService: AuthService
    ) {
        // Ensure Arabic is the default language immediately
        this.translate.setDefaultLang('ar');
        const currentLang = localStorage.getItem('language') || 'ar';
        this.translate.use(currentLang);
        this.languageService.setPageDirection(currentLang);

        this.router.events
            .pipe(filter(event => event instanceof NavigationStart))
            .subscribe(() => {
                this.toastService.clearAll();
            });
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            // console.log('ROUTER EVENT', event);

            if (event instanceof NavigationEnd) {
                window.scrollTo({top: 0, behavior: 'smooth'}); // or just window.scrollTo(0, 0);
            }
        });
    }

    ngAfterViewInit() {
        console.log('Assigning timeoutModal:', this.timeoutModal);
        this.idleTimeoutService.setModal(this.timeoutModal);
    }

    onStayLoggedIn() {
        this.idleTimeoutService.userChoseToStayLoggedIn();
    }

    logout(): void {
        this.authService.logout()
            .pipe(
                finalize(() => {
                    // This will run whether success or error
                    this.authService.clearUserSession();
                    if (this.timeoutModal) {
                        this.timeoutModal.hide();
                    }
                    void this.router.navigate(['/auth/login']);
                })
            )
            .subscribe({
                error: (error) => {
                    this.toastService.show(
                        this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
                        {classname: 'bg-danger text-white', autohide: false}
                    );
                }
            });
    }

}
