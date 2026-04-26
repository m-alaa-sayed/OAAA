import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderAnalysisStepComponent } from './team-leader-analysis-step.component';

describe('TeamLeaderAnalysisStepComponent', () => {
  let component: TeamLeaderAnalysisStepComponent;
  let fixture: ComponentFixture<TeamLeaderAnalysisStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderAnalysisStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderAnalysisStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
