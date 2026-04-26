import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewResultsComponent } from './external-review-results.component';

describe('ExternalReviewResultsComponent', () => {
  let component: ExternalReviewResultsComponent;
  let fixture: ComponentFixture<ExternalReviewResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
