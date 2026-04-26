import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeStepComponent } from './pledge-step.component';

describe('PledgeStepComponent', () => {
  let component: PledgeStepComponent;
  let fixture: ComponentFixture<PledgeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PledgeStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
