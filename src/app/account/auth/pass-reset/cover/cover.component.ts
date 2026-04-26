import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/core/services/auth.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {Router} from "@angular/router";

@Component({
    selector: 'app-cover',
    templateUrl: './cover.component.html',
    styleUrls: ['./cover.component.scss']
})

/**
 * Cover Component
 */
export class CoverComponent implements OnInit {

    // Login Form
    passresetForm!: FormGroup;
    submitted = false;
    fieldTextType!: boolean;
    error = '';
    returnUrl!: string;
    // set the current year
    year: number = new Date().getFullYear();
    // Carousel navigation arrow show
    showNavigationArrows: any;

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthService,
        private toastService: ToastService,
        private translate: TranslateService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        /**
         * Form Validation
         */
        this.passresetForm = this.formBuilder.group({
            email: ['', [Validators.required]]
        });
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.passresetForm.controls;
    }

    /**
     * Form submit
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.passresetForm.invalid) {
            return;
        }
        this.authenticationService.forgotPassword(this.f['email'].value).subscribe({
            next: (res) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.EMAIL_SENT_PLEASE_CHECK'), {classname: 'bg-success text-white', delay: 3000});
                setTimeout(() => {
                  void this.router.navigate(['/auth/login']);
                }, 2000);
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }
}
