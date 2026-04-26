import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendicesStepComponent } from './appendices-step.component';

describe('AppendicesStepComponent', () => {
  let component: AppendicesStepComponent;
  let fixture: ComponentFixture<AppendicesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendicesStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppendicesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
