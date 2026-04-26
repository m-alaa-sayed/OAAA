import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryVisitReportTabComponent } from './summary-visit-report-tab.component';

describe('SummaryVisitReportTabComponent', () => {
  let component: SummaryVisitReportTabComponent;
  let fixture: ComponentFixture<SummaryVisitReportTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryVisitReportTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryVisitReportTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
