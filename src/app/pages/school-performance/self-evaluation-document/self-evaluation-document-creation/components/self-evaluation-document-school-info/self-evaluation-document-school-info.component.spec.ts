import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentSchoolInfoComponent } from './self-evaluation-document-school-info.component';

describe('SelfEvaluationDocumentSchoolInfoComponent', () => {
  let component: SelfEvaluationDocumentSchoolInfoComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentSchoolInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentSchoolInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentSchoolInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
