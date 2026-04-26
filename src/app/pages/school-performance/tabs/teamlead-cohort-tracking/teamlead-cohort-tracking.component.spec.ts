import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamleadCohortTrackingComponent } from './teamlead-cohort-tracking.component';

describe('TeamleadCohortTrackingComponent', () => {
  let component: TeamleadCohortTrackingComponent;
  let fixture: ComponentFixture<TeamleadCohortTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamleadCohortTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamleadCohortTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
