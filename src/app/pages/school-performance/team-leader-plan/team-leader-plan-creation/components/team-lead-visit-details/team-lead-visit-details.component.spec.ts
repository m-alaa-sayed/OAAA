import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamLeadVisitDetailsComponent } from './team-lead-visit-details.component';


describe('TeamLeadVisitDetailsComponent', () => {
  let component: TeamLeadVisitDetailsComponent;
  let fixture: ComponentFixture<TeamLeadVisitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeadVisitDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeadVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
