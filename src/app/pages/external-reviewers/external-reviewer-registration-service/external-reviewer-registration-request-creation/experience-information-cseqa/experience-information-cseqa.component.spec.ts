import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceInformationCseqaComponent } from './experience-information-cseqa.component';

describe('ExperienceInformationCseqaComponent', () => {
  let component: ExperienceInformationCseqaComponent;
  let fixture: ComponentFixture<ExperienceInformationCseqaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceInformationCseqaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceInformationCseqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
