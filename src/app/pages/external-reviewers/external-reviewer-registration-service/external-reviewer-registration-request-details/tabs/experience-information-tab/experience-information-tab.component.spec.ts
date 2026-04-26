import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceInformationTabComponent } from './experience-information-tab.component';

describe('ExperienceInformationTabComponent', () => {
  let component: ExperienceInformationTabComponent;
  let fixture: ComponentFixture<ExperienceInformationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceInformationTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceInformationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
