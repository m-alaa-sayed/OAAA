import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderPlanListComponent } from './team-leader-plan-list.component';

describe('TeamLeaderPlanListComponent', () => {
  let component: TeamLeaderPlanListComponent;
  let fixture: ComponentFixture<TeamLeaderPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderPlanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
