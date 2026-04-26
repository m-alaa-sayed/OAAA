import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewersTrainingResultTableComponent } from './external-reviewers-training-result-table.component';

describe('ExternalReviewersTrainingResultTableComponent', () => {
  let component: ExternalReviewersTrainingResultTableComponent;
  let fixture: ComponentFixture<ExternalReviewersTrainingResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewersTrainingResultTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewersTrainingResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
