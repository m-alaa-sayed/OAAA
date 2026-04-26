import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelfEvaluationDocumentCleanerService {

  removeAverageRows<T>(obj: T): T {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeAverageRows(item)) as T;
    }

    if (obj !== null && typeof obj === 'object') {
      const clone: any = {};
      for (const key of Object.keys(obj)) {
        if (key === 'subjects' && Array.isArray((obj as any)[key])) {
          clone[key] = (obj as any)[key]
            .filter((s: any) => !s.isAverageRow)
            .map((s: any) => this.removeAverageRows(s));
        } else {
          clone[key] = this.removeAverageRows((obj as any)[key]);
        }
      }
      return clone;
    }

    return obj;
  }
}
