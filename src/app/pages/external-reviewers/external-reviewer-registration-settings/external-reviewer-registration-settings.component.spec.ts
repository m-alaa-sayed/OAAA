import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerRegistrationSettingsComponent } from './external-reviewer-registration-settings.component';

describe('ExternalReviewerRegisterSettingsComponent', () => {
  let component: ExternalReviewerRegistrationSettingsComponent;
  let fixture: ComponentFixture<ExternalReviewerRegistrationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerRegistrationSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerRegistrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
