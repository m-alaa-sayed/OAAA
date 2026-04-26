import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceInformationCheqaComponent } from './experience-information-cheqa.component';

describe('ExperienceInformationCheqaComponent', () => {
  let component: ExperienceInformationCheqaComponent;
  let fixture: ComponentFixture<ExperienceInformationCheqaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceInformationCheqaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceInformationCheqaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
