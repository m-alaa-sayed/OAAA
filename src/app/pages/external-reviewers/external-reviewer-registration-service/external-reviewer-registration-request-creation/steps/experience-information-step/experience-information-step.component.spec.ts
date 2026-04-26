import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceInformationStepComponent } from './experience-information-step.component';

describe('ExperienceInformationStepComponent', () => {
  let component: ExperienceInformationStepComponent;
  let fixture: ComponentFixture<ExperienceInformationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceInformationStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceInformationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
