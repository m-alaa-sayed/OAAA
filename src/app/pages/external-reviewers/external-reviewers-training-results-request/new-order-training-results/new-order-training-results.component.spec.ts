import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrderTrainingResultsComponent } from './new-order-training-results.component';

describe('NewOrderTrainingResultsComponent', () => {
  let component: NewOrderTrainingResultsComponent;
  let fixture: ComponentFixture<NewOrderTrainingResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderTrainingResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOrderTrainingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
