import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            // Skip logging if refresh token request fails
            if (request.url.includes('/auth/refresh-token') && err.status === 401) {
                return throwError(() => err);
            }

            const errorCode = err?.error?.errorCode || 'GENERAL_ERROR';
            return throwError(() => errorCode);
        }))
    }
}
