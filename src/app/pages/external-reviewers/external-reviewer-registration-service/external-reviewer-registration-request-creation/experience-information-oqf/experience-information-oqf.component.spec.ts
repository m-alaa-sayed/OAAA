import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceInformationOqfComponent } from './experience-information-oqf.component';

describe('ExperienceInformationOqfComponent', () => {
  let component: ExperienceInformationOqfComponent;
  let fixture: ComponentFixture<ExperienceInformationOqfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceInformationOqfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceInformationOqfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
