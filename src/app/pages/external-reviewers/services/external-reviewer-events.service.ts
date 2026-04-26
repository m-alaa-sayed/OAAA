import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerEventsService {

  constructor() { }


  private reviewerUpdatedSource = new Subject<void>();
  reviewerUpdated$ = this.reviewerUpdatedSource.asObservable();

  emitReviewerUpdated() {
    this.reviewerUpdatedSource.next();
  }
}
