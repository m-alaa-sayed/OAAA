import { TestBed } from '@angular/core/testing';

import { ImportDomainSummaryFormsService } from './import-domain-summary-forms.service';

describe('ImportDomainSummaryFormsService', () => {
  let service: ImportDomainSummaryFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportDomainSummaryFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
