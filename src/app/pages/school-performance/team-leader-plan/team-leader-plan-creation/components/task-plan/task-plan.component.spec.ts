import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlanComponent } from './task-plan.component';

describe('TaskPlanComponent', () => {
  let component: TaskPlanComponent;
  let fixture: ComponentFixture<TaskPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
