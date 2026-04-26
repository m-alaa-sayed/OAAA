import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewVisitReportsDetailsComponent } from './external-review-visit-reports-details.component';

describe('ExternalReviewVisitReportsDetailsComponent', () => {
  let component: ExternalReviewVisitReportsDetailsComponent;
  let fixture: ComponentFixture<ExternalReviewVisitReportsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewVisitReportsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewVisitReportsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
