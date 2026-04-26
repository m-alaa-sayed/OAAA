import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderAnalysisTabComponent } from './team-leader-analysis-tab.component';

describe('TeamLeaderAnalysisTabComponent', () => {
  let component: TeamLeaderAnalysisTabComponent;
  let fixture: ComponentFixture<TeamLeaderAnalysisTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderAnalysisTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderAnalysisTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
