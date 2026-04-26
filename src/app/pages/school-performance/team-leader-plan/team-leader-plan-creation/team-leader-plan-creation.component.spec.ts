import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderPlanCreationComponent } from './team-leader-plan-creation.component';

describe('TeamLeaderPlanCreationComponent', () => {
  let component: TeamLeaderPlanCreationComponent;
  let fixture: ComponentFixture<TeamLeaderPlanCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderPlanCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderPlanCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
