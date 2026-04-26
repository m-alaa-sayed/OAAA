import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryOverallSchoolPerformanceTabComponent } from './summary-overall-school-performance-tab.component';

describe('SummaryOverallSchoolPerformanceTabComponent', () => {
  let component: SummaryOverallSchoolPerformanceTabComponent;
  let fixture: ComponentFixture<SummaryOverallSchoolPerformanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryOverallSchoolPerformanceTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryOverallSchoolPerformanceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
