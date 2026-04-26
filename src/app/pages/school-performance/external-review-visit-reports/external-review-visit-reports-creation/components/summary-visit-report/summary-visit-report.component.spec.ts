import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryVisitReportComponent } from './summary-visit-report.component';

describe('SummaryVisitReportComponent', () => {
  let component: SummaryVisitReportComponent;
  let fixture: ComponentFixture<SummaryVisitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryVisitReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryVisitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
