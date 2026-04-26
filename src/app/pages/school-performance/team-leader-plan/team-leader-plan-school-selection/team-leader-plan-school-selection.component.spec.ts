import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderPlanSchoolSelectionComponent } from './team-leader-plan-school-selection.component';

describe('TeamLeaderPlanSchoolSelectionComponent', () => {
  let component: TeamLeaderPlanSchoolSelectionComponent;
  let fixture: ComponentFixture<TeamLeaderPlanSchoolSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderPlanSchoolSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderPlanSchoolSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
