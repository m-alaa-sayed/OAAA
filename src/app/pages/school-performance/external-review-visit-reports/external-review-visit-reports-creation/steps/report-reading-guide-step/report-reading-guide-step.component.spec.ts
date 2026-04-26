import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReadingGuideStepComponent } from './report-reading-guide-step.component';

describe('ReportReadingGuideStepComponent', () => {
  let component: ReportReadingGuideStepComponent;
  let fixture: ComponentFixture<ReportReadingGuideStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportReadingGuideStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReadingGuideStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
