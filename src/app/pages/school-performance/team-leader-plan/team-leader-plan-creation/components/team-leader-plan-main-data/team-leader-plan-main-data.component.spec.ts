import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderPlanMainDataComponent } from './team-leader-plan-main-data.component';

describe('TeamLeaderPlanMainDataComponent', () => {
  let component: TeamLeaderPlanMainDataComponent;
  let fixture: ComponentFixture<TeamLeaderPlanMainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderPlanMainDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderPlanMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
