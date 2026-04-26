import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictOfInterestDisclosureStepComponent } from './conflict-of-interest-disclosure-step.component';

describe('ConflictOfInterestDisclosureStepComponent', () => {
  let component: ConflictOfInterestDisclosureStepComponent;
  let fixture: ComponentFixture<ConflictOfInterestDisclosureStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictOfInterestDisclosureStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConflictOfInterestDisclosureStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
