import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlanStepComponent } from './task-plan-step.component';

describe('TaskPlanStepComponent', () => {
  let component: TaskPlanStepComponent;
  let fixture: ComponentFixture<TaskPlanStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPlanStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPlanStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
