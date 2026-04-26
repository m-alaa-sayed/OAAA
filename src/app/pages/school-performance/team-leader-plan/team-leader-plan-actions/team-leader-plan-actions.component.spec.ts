import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderPlanActionsComponent } from './team-leader-plan-actions.component';

describe('TeamLeaderPlanActionsComponent', () => {
  let component: TeamLeaderPlanActionsComponent;
  let fixture: ComponentFixture<TeamLeaderPlanActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderPlanActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderPlanActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
