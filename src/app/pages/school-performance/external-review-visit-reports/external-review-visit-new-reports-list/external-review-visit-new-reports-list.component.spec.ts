import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewVisitNewReportsListComponent } from './external-review-visit-new-reports-list.component';

describe('ExternalReviewVisitNewReportsListComponent', () => {
  let component: ExternalReviewVisitNewReportsListComponent;
  let fixture: ComponentFixture<ExternalReviewVisitNewReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewVisitNewReportsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewVisitNewReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
