import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDocumentDownloaderComponent } from './report-document-downloader.component';

describe('ReportDocumentDownloaderComponent', () => {
  let component: ReportDocumentDownloaderComponent;
  let fixture: ComponentFixture<ReportDocumentDownloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDocumentDownloaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDocumentDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
