import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceCollectionFormsStatisticsComponent } from './evidence-collection-forms-statistics.component';

describe('EvidenceCollectionFormsStatisticsComponent', () => {
  let component: EvidenceCollectionFormsStatisticsComponent;
  let fixture: ComponentFixture<EvidenceCollectionFormsStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvidenceCollectionFormsStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvidenceCollectionFormsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
