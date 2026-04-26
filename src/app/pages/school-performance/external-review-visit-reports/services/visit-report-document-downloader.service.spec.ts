import { TestBed } from '@angular/core/testing';

import { VisitReportDocumentDownloaderService } from './visit-report-document-downloader.service';

describe('VisitReportDocumentDownloaderService', () => {
  let service: VisitReportDocumentDownloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitReportDocumentDownloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
