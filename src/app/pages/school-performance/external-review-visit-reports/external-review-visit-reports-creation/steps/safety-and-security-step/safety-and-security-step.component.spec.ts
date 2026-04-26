import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAndSecurityStepComponent } from './safety-and-security-step.component';

describe('SafetyAndSecurityStepComponent', () => {
  let component: SafetyAndSecurityStepComponent;
  let fixture: ComponentFixture<SafetyAndSecurityStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyAndSecurityStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyAndSecurityStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
