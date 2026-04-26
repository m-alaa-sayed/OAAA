import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentAnalysisStepComponent } from './self-evaluation-document-analysis-step.component';

describe('SelfEvaluationDocumentAnalysisStepComponent', () => {
  let component: SelfEvaluationDocumentAnalysisStepComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentAnalysisStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentAnalysisStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentAnalysisStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
