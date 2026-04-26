import { TestBed } from '@angular/core/testing';

import { OnJudgmentChangeUtilsService } from './on-judgment-change-utils.service';

describe('OnJudgmentChangeUtilsService', () => {
  let service: OnJudgmentChangeUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnJudgmentChangeUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
