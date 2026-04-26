import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppResponse } from '../models/app-response';
import { AppConstants } from '../constants/app-constants';
import { environment } from 'src/environments/environment';

export interface ReorderItem {
  id: any;
  index: number;
}

@Injectable({
  providedIn: 'root'
})
export class GridReorderService {

  constructor(private http: HttpClient) { }

  /**
   * Send the reordered items to the backend
   * @param items Array of items with their new indexes
   * @param module Optional module identifier (e.g., 'CATEGORIES', 'SERVICES', etc.)
   * @returns Observable of the API response
   */
  updateItemsOrder({module, items, type, parentId}: {module: string, items: ReorderItem[], type: string, parentId: number | null}): Observable<AppResponse<void>> {
    // const endpoint = `${AppConstants.API.BASE_URL}/${module}/reorder/`;
    const endpoint = `${environment.baseURL}/oaaaqa/api/external-reviewers-acceptance-criteria/${module}/reorder`;

    // 
    const body = { type, parentId, items };
    console.log('Updating order with body:', body);
    
    return this.http.patch<AppResponse<void>>(endpoint, body);
  }

}