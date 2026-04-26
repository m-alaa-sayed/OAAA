import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlanMemberComponent } from './task-plan-member.component';

describe('TaskPlanMemberComponent', () => {
  let component: TaskPlanMemberComponent;
  let fixture: ComponentFixture<TaskPlanMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPlanMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPlanMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
