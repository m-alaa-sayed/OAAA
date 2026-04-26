import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAndSecurityTabComponent } from './safety-and-security-tab.component';

describe('SafetyAndSecurityTabComponent', () => {
  let component: SafetyAndSecurityTabComponent;
  let fixture: ComponentFixture<SafetyAndSecurityTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyAndSecurityTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyAndSecurityTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
