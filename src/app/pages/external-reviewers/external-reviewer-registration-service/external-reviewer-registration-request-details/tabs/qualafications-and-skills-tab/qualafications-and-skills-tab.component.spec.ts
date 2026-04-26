import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualaficationsAndSkillsTabComponent } from './qualafications-and-skills-tab.component';

describe('QualaficationsAndSkillsTabComponent', () => {
  let component: QualaficationsAndSkillsTabComponent;
  let fixture: ComponentFixture<QualaficationsAndSkillsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualaficationsAndSkillsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualaficationsAndSkillsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
