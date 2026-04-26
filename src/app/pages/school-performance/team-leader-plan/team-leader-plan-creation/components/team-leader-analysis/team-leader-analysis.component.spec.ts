import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderAnalysisComponent } from './team-leader-analysis.component';

describe('TeamLeaderAnalysisComponent', () => {
  let component: TeamLeaderAnalysisComponent;
  let fixture: ComponentFixture<TeamLeaderAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
