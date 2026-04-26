import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailInfoStepComponent } from './email-info-step.component';

describe('EmailInfoStepComponent', () => {
  let component: EmailInfoStepComponent;
  let fixture: ComponentFixture<EmailInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailInfoStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
