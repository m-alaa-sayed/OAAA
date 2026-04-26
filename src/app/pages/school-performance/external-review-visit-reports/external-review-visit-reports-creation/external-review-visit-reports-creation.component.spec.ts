import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewVisitReportsCreationComponent } from './external-review-visit-reports-creation.component';

describe('ExternalReviewVisitReportsCreationComponent', () => {
  let component: ExternalReviewVisitReportsCreationComponent;
  let fixture: ComponentFixture<ExternalReviewVisitReportsCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewVisitReportsCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewVisitReportsCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
