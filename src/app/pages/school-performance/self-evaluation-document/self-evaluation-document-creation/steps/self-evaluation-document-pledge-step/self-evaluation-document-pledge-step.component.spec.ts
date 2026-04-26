import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentPledgeStepComponent } from './self-evaluation-document-pledge-step.component';

describe('SelfEvaluationDocumentPledgeStepComponent', () => {
  let component: SelfEvaluationDocumentPledgeStepComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentPledgeStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentPledgeStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentPledgeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
