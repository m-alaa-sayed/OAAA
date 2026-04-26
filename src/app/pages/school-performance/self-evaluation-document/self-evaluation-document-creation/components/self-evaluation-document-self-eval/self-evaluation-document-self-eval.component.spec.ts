import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentSelfEvalComponent } from './self-evaluation-document-self-eval.component';

describe('SelfEvaluationDocumentSelfEvalComponent', () => {
  let component: SelfEvaluationDocumentSelfEvalComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentSelfEvalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentSelfEvalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentSelfEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
