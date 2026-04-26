import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentListComponent } from './self-evaluation-document-list.component';

describe('SelfEvaluationDocumentListComponent', () => {
  let component: SelfEvaluationDocumentListComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
