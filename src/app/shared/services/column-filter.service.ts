import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColumnFilterService {

  constructor(private translate: TranslateService) {}

  /**
   * Initialize hardcoded filter options for fallback
   * @param module - The module name (CSEQA, CHEQA, OQF)
   * @param fieldName - The field name to apply filter to
   * @returns Object with field filter options or empty object
   */
  initializeStatusFilterOptions(module: string, fieldName: string = 'registrationStatus'): { [key: string]: string[] } {
    // Only set dropdown filter options for CSEQA module
    if (module === 'CSEQA') {
      return {
        [fieldName]: [
          this.translate.instant('PAGES.COMMON.LABELS.PENDING'),
          this.translate.instant('PAGES.COMMON.LABELS.APPROVED'), 
          this.translate.instant('PAGES.COMMON.LABELS.REJECTED'),
          this.translate.instant('PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA')
        ]
      };
    } else {
      // No dropdown filters for other modules
      return {};
    }
  }

  /**
   * Load status options from API and transform them
   * @param module - The module name (CSEQA, CHEQA, OQF)
   * @param fieldName - The field name to apply filter to
   * @param apiCall - Observable that returns the API response
   * @returns Observable with transformed filter options
   */
  loadStatusFilterOptions(
    module: string, 
    fieldName: string = 'registrationStatus',
    apiCall: Observable<any>
  ): Observable<{ [key: string]: string[] }> {
    
    // Only enable dropdown filter for CSEQA module
    if (module !== 'CSEQA') {
      return of({}); // No dropdown filters for other modules
    }

    return apiCall.pipe(
      map((response) => {
        const statusOptions = response.data || [];
        if (statusOptions.length > 0) {
          // Transform raw status values to match what valueGetter returns
          const translatedOptions = statusOptions.map((status: string) => {
            if (module === 'CSEQA' && status === 'MET') {
              return this.translate.instant('PAGES.COMMON.LABELS.MET_INITIAL_CRITERIA');
            }
            return this.translate.instant(`PAGES.COMMON.LABELS.${status}`);
          });
          
          return {
            [fieldName]: translatedOptions
          };
        }
        return {};
      }),
      catchError(() => {
        // Return fallback options if API fails
        return of(this.initializeStatusFilterOptions(module, fieldName));
      })
    );
  }

  /**
   * Generic method to handle complete filter options setup
   * @param module - The module name (CSEQA, CHEQA, OQF)
   * @param fieldName - The field name to apply filter to
   * @param apiCall - Optional Observable that returns the API response
   * @returns Observable with filter options
   */
  setupStatusFilterOptions(
    module: string, 
    fieldName: string = 'registrationStatus',
    apiCall?: Observable<any>
  ): Observable<{ [key: string]: string[] }> {
    
    if (!apiCall) {
      // Return just the initialized options if no API call provided
      return of(this.initializeStatusFilterOptions(module, fieldName));
    }

    return this.loadStatusFilterOptions(module, fieldName, apiCall);
  }
}