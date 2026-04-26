import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepActionButtonsComponent } from './step-action-buttons.component';

describe('StepActionButtonsComponent', () => {
  let component: StepActionButtonsComponent;
  let fixture: ComponentFixture<StepActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepActionButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
