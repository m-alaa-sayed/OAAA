import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerRegistrationRequestsComponent } from './external-reviewer-registration-requests.component';

describe('ExternalReviewerRegistrationRequestsComponent', () => {
  let component: ExternalReviewerRegistrationRequestsComponent;
  let fixture: ComponentFixture<ExternalReviewerRegistrationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerRegistrationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerRegistrationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
