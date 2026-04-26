import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAppendicesStepComponent } from './summary-appendices-step.component';

describe('SummaryAppendicesStepComponent', () => {
  let component: SummaryAppendicesStepComponent;
  let fixture: ComponentFixture<SummaryAppendicesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryAppendicesStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryAppendicesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
