import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentDetailsComponent } from './self-evaluation-document-creation.component';

describe('SelfEvaluationDocumentDetailsComponent', () => {
  let component: SelfEvaluationDocumentDetailsComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
