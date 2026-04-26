import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentSchoolInfoStepComponent } from './self-evaluation-document-school-info-step.component';

describe('SelfEvaluationDocumentSchoolInfoStepComponent', () => {
  let component: SelfEvaluationDocumentSchoolInfoStepComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentSchoolInfoStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentSchoolInfoStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentSchoolInfoStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
