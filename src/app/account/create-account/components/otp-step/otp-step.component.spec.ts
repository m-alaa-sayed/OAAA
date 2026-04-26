import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpStepComponent } from './otp-step.component';

describe('OtpStepComponent', () => {
  let component: OtpStepComponent;
  let fixture: ComponentFixture<OtpStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
