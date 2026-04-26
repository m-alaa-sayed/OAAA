import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualaficationsAndSkillsComponent } from './qualafications-and-skills.component';

describe('QualaficationsAndSkillsComponent', () => {
  let component: QualaficationsAndSkillsComponent;
  let fixture: ComponentFixture<QualaficationsAndSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualaficationsAndSkillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualaficationsAndSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
