import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerRegistrationRequestCreationComponent } from './external-reviewer-registration-request-creation.component';

describe('ExternalReviewerRegistrationComponent', () => {
  let component: ExternalReviewerRegistrationRequestCreationComponent;
  let fixture: ComponentFixture<ExternalReviewerRegistrationRequestCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerRegistrationRequestCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerRegistrationRequestCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
