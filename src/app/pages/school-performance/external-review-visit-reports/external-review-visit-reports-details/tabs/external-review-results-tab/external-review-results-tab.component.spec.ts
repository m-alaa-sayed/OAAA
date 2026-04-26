import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewResultsTabComponent } from './external-review-results-tab.component';

describe('ExternalReviewResultsTabComponent', () => {
  let component: ExternalReviewResultsTabComponent;
  let fixture: ComponentFixture<ExternalReviewResultsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewResultsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewResultsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
