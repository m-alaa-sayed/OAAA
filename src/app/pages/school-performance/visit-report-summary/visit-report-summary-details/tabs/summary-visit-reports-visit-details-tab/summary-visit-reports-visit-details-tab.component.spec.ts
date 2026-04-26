import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryVisitReportsVisitDetailsTabComponent } from './summary-visit-reports-visit-details-tab.component';

describe('SummaryVisitReportsVisitDetailsTabComponent', () => {
  let component: SummaryVisitReportsVisitDetailsTabComponent;
  let fixture: ComponentFixture<SummaryVisitReportsVisitDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryVisitReportsVisitDetailsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryVisitReportsVisitDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
