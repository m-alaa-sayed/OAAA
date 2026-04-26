import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentSelfEvalStepComponent } from './self-evaluation-document-self-eval-step.component';

describe('SelfEvaluationDocumentSelfEvalStepComponent', () => {
  let component: SelfEvaluationDocumentSelfEvalStepComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentSelfEvalStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentSelfEvalStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentSelfEvalStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
