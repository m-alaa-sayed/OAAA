import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {SessionTimeoutWarningComponent} from 'src/app/shared/session-timeout-warning/session-timeout-warning.component';
import {environment} from 'src/environments/environment';
import {AuthService} from './auth.service';
import {ToastService} from './toast-service';
import {finalize} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class IdleTimeoutService {

    private idleLimit = environment.session_idle_limit; // e.g. 30 * 60 * 1000
    private warningTime = environment.session_idle_warning; // e.g. 1 * 60 * 1000
    private timeout: any;
    private warningTimeout: any;
    private timeoutModal!: SessionTimeoutWarningComponent;

    private mouseMoveHandler = () => this.resetTimer();
    private keyDownHandler = () => this.resetTimer();

    constructor(
        private router: Router,
        public translate: TranslateService,
        private authService: AuthService,
        private toastService: ToastService
    ) {
        this.authService.getUserClaimObservable().subscribe(userClaim => {
            if (userClaim) {
                this.resetTimer();
                this.setupListeners();
            } else {
                this.removeListeners();
            }
        });
    }

    setModal(modal: SessionTimeoutWarningComponent) {
        this.timeoutModal = modal;
    }

    private setupListeners() {
        document.addEventListener('mousemove', this.mouseMoveHandler);
        document.addEventListener('keydown', this.keyDownHandler);
    }

    private removeListeners() {
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('keydown', this.keyDownHandler);
    }

    private resetTimer() {
        clearTimeout(this.timeout);
        clearTimeout(this.warningTimeout);
        // Start warning timer (e.g. 29 mins if idleLimit is 30 mins)
        this.warningTimeout = setTimeout(() => {
            this.showWarning();
        }, this.idleLimit - this.warningTime);

        // Hard logout timer (e.g. 30 mins)
        this.timeout = setTimeout(() => this.logout(), this.idleLimit);
    }

    private showWarning() {
        if (this.timeoutModal) {
            this.timeoutModal.show(this.warningTime);
        }

        // Auto-logout after warning time if user does nothing
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.logout(), this.warningTime);
    }

    userChoseToStayLoggedIn() {
        clearTimeout(this.timeout);
        clearTimeout(this.warningTimeout);

        if (this.timeoutModal) {
            this.timeoutModal.hide();
        }

        this.resetTimer();
    }

    private logout() {
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
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
                }
            });
    }

}
