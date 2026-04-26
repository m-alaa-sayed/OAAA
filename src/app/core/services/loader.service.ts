import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private loadingTimeout: any;
  private readonly MAX_LOADING_TIME = 30000; // 30 seconds max loading time

  show() {
    this.isLoading.next(true);
    
    // Clear any existing timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    
    // Set a maximum loading time to prevent stuck loading
    this.loadingTimeout = setTimeout(() => {
      console.warn('LoaderService: Forced hiding loader after maximum loading time');
      this.hide();
    }, this.MAX_LOADING_TIME);
  }

  hide() {
    this.isLoading.next(false);
    
    // Clear the timeout when hiding explicitly
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
  }

  /**
   * Force hide the loader - use only in emergency cases
   */
  forceHide() {
    console.warn('LoaderService: Force hiding loader');
    this.hide();
  }
} 