import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {LanguageUtil} from "../util/language.util";
import {AppConstants} from "../constants/app-constants";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshedAccessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!this.isPublicRequest(request) && this.notLoginOrRefreshTokenRequest(request.url) && this.authService.isLoggedIn()) {
            request = this.addToken(request);
        }


        request = request.clone({
            setHeaders: {
                'Accept-Language': LanguageUtil.lang,
                'Channel': 'JAWDA_WEB',
                "ngrok-skip-browser-warning": "1"
            }
        });


        return next.handle(request).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401 && this.notLoginOrRefreshTokenRequest(request.url) && this.authService.getAccessToken() !== null) {
                    return this.handle401Error(request, next);
                } else {
                    throw error;
                }
            })
        );
    }

    private notLoginOrRefreshTokenRequest(url: string) {
        return ![
            AppConstants.API.LOGIN,
            AppConstants.API.REFRESH_TOKEN
        ].includes(url);
    }

    private isPublicRequest(request: HttpRequest<unknown>) {
        return request.url.includes('/public/');
    }

    private addToken(request: HttpRequest<any>) {
        return request.clone({
            headers: request.headers.set('Authorization', this.authService.getAccessToken() || ''),
        })
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshedAccessTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap(() => {
                    this.isRefreshing = false;
                    this.refreshedAccessTokenSubject.next(this.authService.getAccessToken());
                    return next.handle(this.addToken(request));
                }),
                catchError((error) => {
                    this.isRefreshing = false;

                    let errorCode = error?.error?.errorCode;
                    if (errorCode !== 'INVALID_TOKEN' && errorCode !== 'SESSION_IDLE') {
                        throw error;
                    }

                    this.authService.clearUserSession();
                    void this.router.navigate(['/auth/login']);

                    throw error;
                })
            );
        } else {
            return this.refreshedAccessTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap(() => {
                    return next.handle(this.addToken(request));
                })
            );
        }
    }
}
