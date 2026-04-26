import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfEvaluationDocumentPledgeComponent } from './self-evaluation-document-pledge.component';

describe('SelfEvaluationDocumentPledgeComponent', () => {
  let component: SelfEvaluationDocumentPledgeComponent;
  let fixture: ComponentFixture<SelfEvaluationDocumentPledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfEvaluationDocumentPledgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfEvaluationDocumentPledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
