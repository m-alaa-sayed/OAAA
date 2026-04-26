import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentAttachmentsComponent } from './self-evaluation-document-attachments.component';

describe('SelfEvaluationDocumentAttachmentsComponent', () => {
  let component: SelfEvaluationDocumentAttachmentsComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentAttachmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
