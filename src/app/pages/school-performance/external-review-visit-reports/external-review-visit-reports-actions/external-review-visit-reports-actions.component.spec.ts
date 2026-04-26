import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewVisitReportsActionsComponent } from './external-review-visit-reports-actions.component';

describe('ExternalReviewVisitReportsActionsComponent', () => {
  let component: ExternalReviewVisitReportsActionsComponent;
  let fixture: ComponentFixture<ExternalReviewVisitReportsActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewVisitReportsActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewVisitReportsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
