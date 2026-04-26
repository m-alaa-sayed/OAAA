import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDetailsStepComponent } from './visit-details-step.component';

describe('VisitDetailsStepComponent', () => {
  let component: VisitDetailsStepComponent;
  let fixture: ComponentFixture<VisitDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitDetailsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
