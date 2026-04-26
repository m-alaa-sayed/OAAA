import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AppConstants} from 'src/app/core/constants/app-constants';
import {AuthService} from 'src/app/core/services/auth.service';
import {ToastService} from 'src/app/core/services/toast-service';

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
    loginForm!: FormGroup;
    submitted = false;
    passwordField!: boolean;
    confirmField!: boolean;
    error = '';
    returnUrl!: string;
    // set the current year
    year: number = new Date().getFullYear();
    // Carousel navigation arrow show
    showNavigationArrows: any;
    resetPasswordCode !: string;

    PASSWORD_PATTERN = AppConstants.PATTERNS.PASSWORD;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthService,
        private toastService: ToastService,
        private translate: TranslateService,
        private route: ActivatedRoute
    ) {
        this.resetPasswordCode = this.route.snapshot.queryParamMap.get('code') || '';
    }

    ngOnInit(): void {
        /**
         * Form Validation
         */
        this.loginForm = this.formBuilder.group(
            {
                password: ['', [Validators.required]],
                cpassword: ['', Validators.required],
            },
            {validator: this.passwordMatchValidator}
        );

        // Password Validation set
        var myInput = document.getElementById("password-input") as HTMLInputElement;
        var letter = document.getElementById("pass-lower");
        var capital = document.getElementById("pass-upper");
        var number = document.getElementById("pass-number");
        var length = document.getElementById("pass-length");

        // When the user clicks on the password field, show the message box
        myInput.onfocus = function () {
            let input = document.getElementById("password-contain") as HTMLElement;
            input.style.display = "block"
        };

        // When the user clicks outside of the password field, hide the password-contain box
        myInput.onblur = function () {
            let input = document.getElementById("password-contain") as HTMLElement;
            input.style.display = "none"
        };

        // When the user starts to type something inside the password field
        myInput.onkeyup = function () {
            // Validate lowercase letters
            var lowerCaseLetters = /[a-z]/g;
            if (myInput.value.match(lowerCaseLetters)) {
                letter?.classList.remove("invalid");
                letter?.classList.add("valid");
            } else {
                letter?.classList.remove("valid");
                letter?.classList.add("invalid");
            }

            // Validate capital letters
            var upperCaseLetters = /[A-Z]/g;
            if (myInput.value.match(upperCaseLetters)) {
                capital?.classList.remove("invalid");
                capital?.classList.add("valid");
            } else {
                capital?.classList.remove("valid");
                capital?.classList.add("invalid");
            }

            // Validate numbers
            var numbers = /[0-9]/g;
            if (myInput.value.match(numbers)) {
                number?.classList.remove("invalid");
                number?.classList.add("valid");
            } else {
                number?.classList.remove("valid");
                number?.classList.add("invalid");
            }

            // Validate length
            if (myInput.value.length >= 12) {
                length?.classList.remove("invalid");
                length?.classList.add("valid");
            } else {
                length?.classList.remove("valid");
                length?.classList.add("invalid");
            }
        };
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('cpassword')?.value;
        return password === confirmPassword ? null : {passwordMismatch: true};
    }


    /**
     * Form submit
     */
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        const resetPasswordRequest = {
            newPassword: this.f['password'].value,
            code: this.resetPasswordCode
        }
        this.authenticationService.resetPassword(resetPasswordRequest).subscribe({
            next: (res) => {
                this.toastService.show(
                    this.translate.instant('PAGES.CREATE_PASSWORD.MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY'),
                    {classname: 'bg-success text-white', delay: 3000}
                );
                void this.router.navigate(['/auth/login']);
            },
            error: (error) => {
                this.toastService.show(
                    this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
                    { classname: 'bg-danger text-white', autohide: false }
                );
            }
        });
    }

    /**
     * Password Hide/Show
     */
    togglepasswordField() {
        this.passwordField = !this.passwordField;
    }

    /**
     * Password Hide/Show
     */
    toggleconfirmField() {
        this.confirmField = !this.confirmField;
    }

}
