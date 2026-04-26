import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, finalize, catchError, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private totalRequests = 0;

    constructor(private loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip loading for requests with 'X-Skip-Loading' header
        if (request.headers.has('X-Skip-Loading')) {
            const modifiedRequest = request.clone({
                headers: request.headers.delete('X-Skip-Loading')
            });
            return next.handle(modifiedRequest);
        }
        if (this.shouldSkipLoader(request)) {
            return next.handle(request);
        }
        this.totalRequests++;
        this.loaderService.show();

        return next.handle(request).pipe(
            catchError(error => {
                console.error('HTTP Request error:', error);
                return throwError(() => error);
            }),
            finalize(() => {
                this.totalRequests = Math.max(0, this.totalRequests - 1);
                if (this.totalRequests === 0) {
                    this.loaderService.hide();
                }
            })
        );
    }

    private shouldSkipLoader(request: HttpRequest<any>): boolean {
        // Skip loader for assets, translations, and other non-essential requests
        const skipUrls = [
            '/assets/',
            '/i18n/',
            '.json',
            'translate',
            'favicon.ico'
        ];

        return skipUrls.some(url => request.url.includes(url)) ||
               request.method === 'GET' && request.url.includes('assets');
    }
}