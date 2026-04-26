import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {EventService} from '../../core/services/event.service';

//Logout
import {environment} from '../../../environments/environment';
import {AuthService} from '../../core/services/auth.service';
import {AuthfakeauthenticationService} from '../../core/services/authfake.service';
import {Router} from '@angular/router';

// Language
import {CookieService} from 'ngx-cookie-service';
import {LanguageService} from '../../core/services/language.service';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserState} from 'src/app/core/states/user.state';
import {User} from 'src/app/core/models/auth.models';
import {ToastService} from 'src/app/core/services/toast-service';
import {TaskCountState} from 'src/app/core/states/task-count.state';
import {UserProfileService} from 'src/app/core/services/user.service';
import {TaskService} from 'src/app/core/services/task.service';
import {finalize} from "rxjs";

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

    @Output() mobileMenuButtonClicked = new EventEmitter();

    userData: User = new User;
    taskCount: number = 0;

    constructor(@Inject(DOCUMENT) private document: any, private eventService: EventService,
                public languageService: LanguageService, private modalService: NgbModal,
                public _cookiesService: CookieService, public translate: TranslateService,
                private authService: AuthService, private authFackservice: AuthfakeauthenticationService,
                private userProfileService: UserProfileService, private taskService: TaskService,
                private router: Router, private toastService: ToastService) {
    }

    ngOnInit(): void {

        UserState.getUserState().subscribe(user => {
            if (user !== null) {
                this.userData = user;
            }
        });

        this.loadTaskCount();

        TaskCountState.getTaskCountState().subscribe(count => {
            this.taskCount = count ?? 0;
        });
    }

    loadTaskCount(): void {
        this.taskService.getTasksCount().subscribe({
            next: (res) => {
                if (res?.data != null) {
                    TaskCountState.setTaskCountState(res.data);
                }
            },
            error: (error) => {
            }
        });
    }

    /**
     * Toggle the menu bar when having mobile screen
     */
    toggleMobileMenu(event: any) {
        document.querySelector('.hamburger-icon')?.classList.toggle('open')
        event.preventDefault();
        this.mobileMenuButtonClicked.emit();
    }

    /**
     * Logout the user
     */
    logout() {
        this.authService.logout()
            .pipe(
                finalize(() => {
                    // This will run whether success or error
                    this.authService.clearUserSession();
                    void this.router.navigate(['/auth/login']);
                })
            )
            .subscribe({
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
                }
            });
    }

    goToUserTasks(): void {
        this.router.navigate(['/jawda/user-tasks/user-tasks-list']);
    }
}
