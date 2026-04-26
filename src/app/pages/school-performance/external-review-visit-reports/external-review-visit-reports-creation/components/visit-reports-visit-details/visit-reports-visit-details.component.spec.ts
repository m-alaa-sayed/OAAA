import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportsVisitDetailsComponent } from './visit-reports-visit-details.component';

describe('VisitReportsVisitDetailsComponent', () => {
  let component: VisitReportsVisitDetailsComponent;
  let fixture: ComponentFixture<VisitReportsVisitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportsVisitDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportsVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
