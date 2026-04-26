import {Injectable} from '@angular/core';
import {User} from 'src/app/store/Authentication/auth.models';
import {HttpClient} from '@angular/common/http';
import {UserState} from '../states/user.state';
import {AppConstants} from '../constants/app-constants';
import {BehaviorSubject, finalize, from, Observable, switchMap, tap} from 'rxjs';
import {LoginRequest} from '../models/login-request';
import {AppResponse} from '../models/app-response';
import {VerifyOtpRequest} from '../models/verify-otp-request';
import {TokenResponse} from '../models/token-response';
import {jwtDecode} from 'jwt-decode';
import {ResetPasswordRequest} from '../models/reset-password-request';
import {UserClaim} from "../models/user-claim";
import {UserProfileService} from "./user.service";
import {Permission} from "../enum/permission";
 
 
@Injectable({ providedIn: 'root' })
 
/**
 * Auth-service Component
 */
export class AuthService {
 
    user!: User;
    private userClaimSubject = new BehaviorSubject<UserClaim | null>(null);
 
    constructor(
        private http: HttpClient,
        private userService: UserProfileService
    ) {
    }
 
    /**
     * login
     * @param loginRequest
     */
    login(loginRequest: LoginRequest) {
        return this.http.post<AppResponse<any>>(AppConstants.API.LOGIN, loginRequest);
    }
 
 
    /**
     * verifyOtp
     * @param verifyOtpRequest
     */
    verifyOtp(verifyOtpRequest: VerifyOtpRequest) {
        return this.http.post<AppResponse<TokenResponse>>(AppConstants.API.VERIFY_OTP, verifyOtpRequest, { withCredentials: true }).pipe(
            switchMap((loginResponse) => from(this.doLoginUser(loginResponse.data, loginResponse.data)))
        );
    }
 
 
    /**
     * resendOtp
     * @param userName
     */
    resendOtp(userName: string) {
        return this.http.get<AppResponse<number>>(`${AppConstants.API.RESEND_OTP}/${userName}`);
    }
 
    /**
     * Logout the user
     */
    logout() {
        return this.http.get<AppResponse<number>>(`${AppConstants.API.LOGOUT}`).pipe(
            finalize(() => {
                this.clearUserSession();
            })
        );
    }
 
    clearUserSession() {
        localStorage.removeItem(AppConstants.PERSISTED_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(AppConstants.PERSISTED_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(AppConstants.PERSISTED_KEYS.CURRENT_USER);
        localStorage.removeItem(AppConstants.PERSISTED_KEYS.USER_ROLES);
        localStorage.removeItem(AppConstants.PERSISTED_KEYS.USER_PERMISSIONS);
        localStorage.removeItem(AppConstants.PERSISTED_KEYS.USER_PROCEDURES);
        this.userClaimSubject.next(null!);
        UserState.setUserState(null!);
    }
 
    /**
     * Reset password
     * @param resetPasswordRequest resetPasswordRequest
     */
    resetPassword(resetPasswordRequest: ResetPasswordRequest) {
        return this.http.post(AppConstants.API.RESET_PASSWORD, resetPasswordRequest);
    }
 
    /**
    * forgotPassword
    * @param userName
    */
    forgotPassword
        (userName: string) {
        return this.http.get(`${AppConstants.API.FORGOT_PASSWORD}?username=${userName}`);
    }
 
 
    private async doLoginUser(loginResponse: TokenResponse, otpResponse?: TokenResponse) {
        this.saveAccessToken(loginResponse.accessToken);
        this.saveRefreshToken(loginResponse.refreshToken);
        await this.loadUserClaim(otpResponse);
    }
 
    private saveAccessToken(accessToken: string) {
        localStorage.setItem(AppConstants.PERSISTED_KEYS.ACCESS_TOKEN, accessToken);
    }
 
    private saveRefreshToken(refreshToken: string) {
        localStorage.setItem(AppConstants.PERSISTED_KEYS.REFRESH_TOKEN, refreshToken);
    }

    private saveUserRoles(roles: string[]) {
        localStorage.setItem(AppConstants.PERSISTED_KEYS.USER_ROLES, JSON.stringify(roles));
    }

    private saveUserPermissions(permissions: string[]) {
        localStorage.setItem(AppConstants.PERSISTED_KEYS.USER_PERMISSIONS, JSON.stringify(permissions));
    }

    private saveUserProcedures(procedures: string[]) {
        localStorage.setItem(AppConstants.PERSISTED_KEYS.USER_PROCEDURES, JSON.stringify(procedures));
    }

    private getUserRoles(): string[] {
        const roles = localStorage.getItem(AppConstants.PERSISTED_KEYS.USER_ROLES);
        return roles ? JSON.parse(roles) : [];
    }

    private getUserPermissions(): string[] {
        const permissions = localStorage.getItem(AppConstants.PERSISTED_KEYS.USER_PERMISSIONS);
        return permissions ? JSON.parse(permissions) : [];
    }

    private getUserProcedures(): string[] {
        const procedures = localStorage.getItem(AppConstants.PERSISTED_KEYS.USER_PROCEDURES);
        return procedures ? JSON.parse(procedures) : [];
    }
 
    loadUserClaim(otpResponse?: TokenResponse): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const accessToken = this.getAccessToken();
            if (!accessToken) return resolve();

            const decodedToken = jwtDecode<{ data: string }>(accessToken);
            if (!decodedToken.data) return resolve();

            const decodedPayloadJson = atob(decodedToken.data);
            const userClaim: UserClaim = JSON.parse(decodedPayloadJson);

            // Use roles, permissions, and procedures from verify OTP response if available
            if (otpResponse && otpResponse.roles && otpResponse.permissions) {
                userClaim.roles = otpResponse.roles;
                userClaim.permissions = otpResponse.permissions as Permission[];
                userClaim.procedures = otpResponse.procedures || [];
                // Save to localStorage for persistence across page reloads
                this.saveUserRoles(otpResponse.roles);
                this.saveUserPermissions(otpResponse.permissions);
                if (otpResponse.procedures) {
                    this.saveUserProcedures(otpResponse.procedures);
                }
            } else {
                // Load roles, permissions, and procedures from localStorage if no OTP response
                userClaim.roles = this.getUserRoles();
                userClaim.permissions = this.getUserPermissions() as Permission[];
                userClaim.procedures = this.getUserProcedures();
            }

            // Always set the userClaim to keep user logged in
            this.userClaimSubject.next(userClaim);
            resolve();
        });
    }

    /** ✅ Get userClaim as an observable (for components & directives to subscribe) */
    getUserClaimObservable(): Observable<UserClaim | null> {
        return this.userClaimSubject.asObservable();
    }

    /** ✅ Get the current userClaim value (useful for synchronous needs) */
    getUserClaim(): UserClaim | null {
        return this.userClaimSubject.getValue();
    }

    isLoggedIn() {
        return this.getUserClaim() !== null;
    }
 
    getAccessToken() {
        return localStorage.getItem(AppConstants.PERSISTED_KEYS.ACCESS_TOKEN);
    }
 
    refreshToken() {
        return this.http.post<AppResponse<TokenResponse>>(
            AppConstants.API.REFRESH_TOKEN, {}, { withCredentials: true }
        )
            .pipe(
                tap((refreshTokenResponse) => {
                    this.saveAccessToken(refreshTokenResponse.data.accessToken);
                })
            );
    }
}