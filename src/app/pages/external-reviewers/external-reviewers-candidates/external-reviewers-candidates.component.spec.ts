import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalReviewerCandidatesComponent } from './external-reviewers-candidates.component';


describe('ExternalReviewerCandidatesComponent', () => {
  let component: ExternalReviewerCandidatesComponent;
  let fixture: ComponentFixture<ExternalReviewerCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
