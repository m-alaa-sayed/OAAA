import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingResultsRequestComponent } from './training-results-request.component';

describe('TrainingResultsRequestComponent', () => {
  let component: TrainingResultsRequestComponent;
  let fixture: ComponentFixture<TrainingResultsRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingResultsRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingResultsRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
