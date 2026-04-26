import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallSchoolPerformanceTabComponent } from './overall-school-performance-tab.component';

describe('OverallSchoolPerformanceTabComponent', () => {
  let component: OverallSchoolPerformanceTabComponent;
  let fixture: ComponentFixture<OverallSchoolPerformanceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallSchoolPerformanceTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallSchoolPerformanceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
