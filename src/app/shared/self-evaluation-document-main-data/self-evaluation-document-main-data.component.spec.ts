import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentMainDataComponent } from './self-evaluation-document-main-data.component';

describe('SelfEvaluationDocumentMainDataComponent', () => {
  let component: SelfEvaluationDocumentMainDataComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentMainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentMainDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
