import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerRegistrationRequestActionsComponent } from './external-reviewer-registration-request-actions.component';

describe('ExternalReviewerRegistrationRequestActionsComponent', () => {
  let component: ExternalReviewerRegistrationRequestActionsComponent;
  let fixture: ComponentFixture<ExternalReviewerRegistrationRequestActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerRegistrationRequestActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerRegistrationRequestActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
