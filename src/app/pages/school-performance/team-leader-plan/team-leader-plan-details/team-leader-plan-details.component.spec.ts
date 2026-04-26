import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderPlanDetailsComponent } from './team-leader-plan-details.component';

describe('TeamLeaderPlanDetailsComponent', () => {
  let component: TeamLeaderPlanDetailsComponent;
  let fixture: ComponentFixture<TeamLeaderPlanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderPlanDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
