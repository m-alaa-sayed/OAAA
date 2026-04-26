import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCommentsStepComponent } from './school-comments-step.component';

describe('SchoolCommentsStepComponent', () => {
  let component: SchoolCommentsStepComponent;
  let fixture: ComponentFixture<SchoolCommentsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolCommentsStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolCommentsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

