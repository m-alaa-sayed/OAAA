import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalReviewerValidationService {

  constructor() { }

  private externalReviewerRegistrationApprovalSubject = new BehaviorSubject<boolean>(false);
  externalReviewerRegistrationApprovalData$ = this.externalReviewerRegistrationApprovalSubject.asObservable();



  submitExternalReviewerRegistrationApprovalAction(isSubmitted: boolean) {
    this.externalReviewerRegistrationApprovalSubject.next(isSubmitted);
  }
}
