import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallSchoolPerformanceComponent } from './overall-school-performance.component';

describe('OverallSchoolPerformanceComponent', () => {
  let component: OverallSchoolPerformanceComponent;
  let fixture: ComponentFixture<OverallSchoolPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallSchoolPerformanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallSchoolPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
