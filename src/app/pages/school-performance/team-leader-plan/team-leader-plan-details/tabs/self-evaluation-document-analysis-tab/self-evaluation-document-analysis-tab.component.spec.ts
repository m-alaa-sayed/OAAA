import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentAnalysisTabComponent } from './self-evaluation-document-analysis-tab.component';

describe('SelfEvaluationDocumentAnalysisTabComponent', () => {
  let component: SelfEvaluationDocumentAnalysisTabComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentAnalysisTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentAnalysisTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentAnalysisTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
