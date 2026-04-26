import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient,
    public translate: TranslateService,
    private toastService: ToastService
  ) { }

  // uploadFile(
  //   uploadFn: (file: File) => Observable<any>,
  //   file: File
  // ): Observable<{ bucketName: string; objectName: string }> {
  //   if (!file) {
  //     return throwError(() => new Error('No file provided'));
  //   }
  
  //   return uploadFn(file).pipe(
  //     map((response: any) => {
  //       const data = response?.data;
  //       if (!data?.bucketName || !data?.objectName) {
  //         throw new Error('Invalid upload response');
  //       }
  //       return {
  //         bucketName: data.bucketName,
  //         objectName: data.objectName
  //       };
  //     }),
  //     catchError((error) => {
  //       this.toastService.show(
  //         this.translate.instant('PAGES.COMMON.MESSAGES.' + error),
  //         { classname: 'bg-danger text-white', autohide: false }
  //       );
  //       return throwError(() => error);
  //     })
  //   );
  // }
  

  // downloadFile(downloadUrlFn: (bucket: any, object: any) => Observable<any>, bucket: any, object: any): void {
  //   if (!bucket || !object) {
  //     console.warn('Missing file details');
  //     return;
  //   }

  //   downloadUrlFn(bucket, object).subscribe({
  //     next: (res) => {
  //       const downloadUrl = res?.data;
  //       if (!downloadUrl) {
  //         console.error('Invalid download URL');
  //         return;
  //       }

  //       fetch(downloadUrl)
  //         .then(response => {
  //           if (!response.ok) {
  //             throw new Error('Download failed');
  //           }
  //           return response.blob();
  //         })
  //         .then(blob => {
  //           const url = window.URL.createObjectURL(blob);
  //           const a = document.createElement('a');
  //           a.href = url;
  //           a.download = object;
  //           document.body.appendChild(a);
  //           a.click();
  //           document.body.removeChild(a);
  //           window.URL.revokeObjectURL(url);
  //         })
  //         .catch(err => console.error('Blob download error:', err));
  //     },
  //     error: (error) => {
  //       this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), { classname: 'bg-danger text-white', autohide: false });
  //     }
  //   });
  // }


}
