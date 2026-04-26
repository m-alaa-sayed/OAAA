import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlanTabComponent } from './task-plan-tab.component';

describe('TaskPlanTabComponent', () => {
  let component: TaskPlanTabComponent;
  let fixture: ComponentFixture<TaskPlanTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPlanTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPlanTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
