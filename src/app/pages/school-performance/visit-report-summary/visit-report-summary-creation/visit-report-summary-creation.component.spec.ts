import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportSummaryCreationComponent } from './visit-report-summary-creation.component';

describe('VisitReportSummaryCreationComponent', () => {
  let component: VisitReportSummaryCreationComponent;
  let fixture: ComponentFixture<VisitReportSummaryCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportSummaryCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportSummaryCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
