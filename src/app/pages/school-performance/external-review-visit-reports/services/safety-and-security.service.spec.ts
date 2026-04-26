import { TestBed } from '@angular/core/testing';

import { SafetyAndSecurityService } from './safety-and-security.service';

describe('SafetyAndSecurityService', () => {
  let service: SafetyAndSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafetyAndSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
