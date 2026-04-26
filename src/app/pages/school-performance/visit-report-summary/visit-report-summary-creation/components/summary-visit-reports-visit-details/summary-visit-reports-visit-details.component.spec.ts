import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryVisitReportsVisitDetailsComponent } from './summary-visit-reports-visit-details.component';

describe('SummaryVisitReportsVisitDetailsComponent', () => {
  let component: SummaryVisitReportsVisitDetailsComponent;
  let fixture: ComponentFixture<SummaryVisitReportsVisitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryVisitReportsVisitDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryVisitReportsVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
