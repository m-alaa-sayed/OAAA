import { Component } from '@angular/core';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'app-debug-loader',
  template: `
    <div class="debug-loader-controls" style="position: fixed; top: 10px; right: 10px; z-index: 10000; background: white; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <strong>Debug Loader</strong><br>
      <small>Loading: {{ (loaderService.isLoading$ | async) ? 'YES' : 'NO' }}</small><br>
      <button type="button" class="btn btn-sm btn-danger mt-1" (click)="forceHideLoader()">
        Force Hide Loader
      </button>
    </div>
  `,
  styles: [`
    .debug-loader-controls {
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .btn {
      font-size: 10px;
      padding: 2px 8px;
    }
  `]
})
export class DebugLoaderComponent {
  constructor(public loaderService: LoaderService) {}

  forceHideLoader() {
    this.loaderService.forceHide();
    console.log('Debug: Forced hiding loader');
  }
}