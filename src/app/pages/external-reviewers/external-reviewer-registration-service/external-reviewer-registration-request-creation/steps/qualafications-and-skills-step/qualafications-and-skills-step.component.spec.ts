import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualaficationsAndSkillsStepComponent } from './qualafications-and-skills-step.component';

describe('QualaficationsAndSkillsStepComponent', () => {
  let component: QualaficationsAndSkillsStepComponent;
  let fixture: ComponentFixture<QualaficationsAndSkillsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualaficationsAndSkillsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualaficationsAndSkillsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
