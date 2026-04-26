import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentAttachmentsStepComponent } from './self-evaluation-document-attachments-step.component';

describe('SelfEvaluationDocumentAttachmentsStepComponent', () => {
  let component: SelfEvaluationDocumentAttachmentsStepComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentAttachmentsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentAttachmentsStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentAttachmentsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
