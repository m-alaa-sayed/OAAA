import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDetailsTabComponent } from './visit-details-tab.component';

describe('VisitDetailsTabComponent', () => {
  let component: VisitDetailsTabComponent;
  let fixture: ComponentFixture<VisitDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitDetailsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
