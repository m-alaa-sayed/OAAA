import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportsVisitDetailsTabComponent } from './visit-reports-visit-details-tab.component';

describe('VisitReportsVisitDetailsTabComponent', () => {
  let component: VisitReportsVisitDetailsTabComponent;
  let fixture: ComponentFixture<VisitReportsVisitDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportsVisitDetailsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportsVisitDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
