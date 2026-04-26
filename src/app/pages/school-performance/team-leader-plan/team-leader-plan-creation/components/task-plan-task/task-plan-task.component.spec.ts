import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlanTaskComponent } from './task-plan-task.component';

describe('TaskPlanTaskComponent', () => {
  let component: TaskPlanTaskComponent;
  let fixture: ComponentFixture<TaskPlanTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPlanTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPlanTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
