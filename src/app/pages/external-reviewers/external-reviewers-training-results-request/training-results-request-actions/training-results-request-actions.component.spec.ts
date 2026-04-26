import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingResultsRequestActionsComponent } from './training-results-request-actions.component';

describe('TrainingResultsRequestActionsComponent', () => {
  let component: TrainingResultsRequestActionsComponent;
  let fixture: ComponentFixture<TrainingResultsRequestActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingResultsRequestActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingResultsRequestActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
