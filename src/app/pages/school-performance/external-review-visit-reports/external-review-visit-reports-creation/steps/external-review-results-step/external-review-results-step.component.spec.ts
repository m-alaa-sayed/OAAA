import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewResultsStepComponent } from './external-review-results-step.component';

describe('ExternalReviewResultsStepComponent', () => {
  let component: ExternalReviewResultsStepComponent;
  let fixture: ComponentFixture<ExternalReviewResultsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewResultsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewResultsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
