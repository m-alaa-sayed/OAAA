import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDetailsModalComponent } from './training-details-modal.component';

describe('TrainingDetailsModalComponent', () => {
  let component: TrainingDetailsModalComponent;
  let fixture: ComponentFixture<TrainingDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
