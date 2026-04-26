import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewVisitReportsListComponent } from './external-review-visit-reports-list.component';

describe('ExternalReviewVisitReportsListComponent', () => {
  let component: ExternalReviewVisitReportsListComponent;
  let fixture: ComponentFixture<ExternalReviewVisitReportsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewVisitReportsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewVisitReportsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
