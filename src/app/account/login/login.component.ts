import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

// Login Auth
import {AuthService} from '../../core/services/auth.service';
import {ToastService} from '../../core/services/toast-service';
import {UserState} from 'src/app/core/states/user.state';
import {TranslateService} from '@ngx-translate/core';
import {VerifyOtpRequest} from 'src/app/core/models/verify-otp-request';
import {UserProfileService} from 'src/app/core/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

    // Login Form
    loginForm!: FormGroup;
    submitted = false;
    fieldTextType!: boolean;
    error = '';
    returnUrl!: string;
    showOtp = false;
    // set the current year
    year: number = new Date().getFullYear();
    verifyOtpRequest: VerifyOtpRequest = {} as VerifyOtpRequest;
    resendActivationTimeInSecond !: number;


    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthService,
        private router: Router,
        private userProfileService: UserProfileService,
        private route: ActivatedRoute,
        private toastService: ToastService,
        public translate: TranslateService
    ) {}

    ngOnInit(): void {

        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    /**
     * Form submit
     */
    onSubmit() {
        this.submitted = true;
        // Login Api
        this.authenticationService.login(this.loginForm.value).subscribe({
            next: (res) => {
                const data = res.data;
                if (data.isPasswordTemp === true) {
                    // Navigate to Create Password page
                    void this.router.navigate(['/auth/pass-create/cover'], {
                        queryParams: {
                            code: data.code
                        }
                    });
                } else {
                    // Navigate to OTP page
                    sessionStorage.removeItem('expiryTime');
                    this.showOtp = true;
                    this.verifyOtpRequest.username = this.f['username'].value;
                    this.resendActivationTimeInSecond = data.otpResendValidationPeriod;
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
            }
        });
    }

    /**
     * Password Hide/Show
     */
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType;
    }


    // otp output functions

    resendOtp() {
        this.resendActivationTimeInSecond = 0;
        const username = this.verifyOtpRequest.username ? this.verifyOtpRequest.username : '';
        this.authenticationService.resendOtp(username).subscribe({
            next: (res) => {
                if (res.data) {
                    this.resendActivationTimeInSecond = res.data;
                    this.showOtp = true;
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }


    verifyOtp(otp: string) {
        this.verifyOtpRequest.otp = otp;
        this.authenticationService.verifyOtp(this.verifyOtpRequest).subscribe({
            next: (res) => {
                this.findUser();
                void this.router.navigate(['/jawda/dashboard']);
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });

                if (error === 'OTP_MAX_FAILURE_ATTEMPTS') {
                    this.showOtp = false;
                }
            }
        });
    }

    findUser() {
        this.userProfileService.findUser().subscribe({
            next: (res) => {
                if (res.data) {
                    UserState.setUserState(res.data);
                }
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    backToLogin() {
        this.showOtp = false;
    }

}
