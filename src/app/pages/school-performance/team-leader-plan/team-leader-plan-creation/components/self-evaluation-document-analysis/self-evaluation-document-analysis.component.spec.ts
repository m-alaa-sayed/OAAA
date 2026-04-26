import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentAnalysisComponent } from './self-evaluation-document-analysis.component';

describe('SelfEvaluationDocumentAnalysisComponent', () => {
  let component: SelfEvaluationDocumentAnalysisComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
