import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportsVisitDetailsStepComponent } from './visit-reports-visit-details-step.component';

describe('VisitReportsVisitDetailsStepComponent', () => {
  let component: VisitReportsVisitDetailsStepComponent;
  let fixture: ComponentFixture<VisitReportsVisitDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportsVisitDetailsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportsVisitDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
