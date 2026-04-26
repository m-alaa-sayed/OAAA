import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOverallSchoolPerformanceComponent } from './summary-overall-school-performance.component';

describe('SummaryOverallSchoolPerformanceComponent', () => {
  let component: SummaryOverallSchoolPerformanceComponent;
  let fixture: ComponentFixture<SummaryOverallSchoolPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryOverallSchoolPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryOverallSchoolPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
