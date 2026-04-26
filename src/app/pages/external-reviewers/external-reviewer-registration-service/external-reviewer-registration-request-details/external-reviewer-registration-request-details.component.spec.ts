import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerRegistrationRequestDetailsComponent } from './external-reviewer-registration-request-details.component';

describe('ExternalReviewerRegistrationRequestDetailsComponent', () => {
  let component: ExternalReviewerRegistrationRequestDetailsComponent;
  let fixture: ComponentFixture<ExternalReviewerRegistrationRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerRegistrationRequestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerRegistrationRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
