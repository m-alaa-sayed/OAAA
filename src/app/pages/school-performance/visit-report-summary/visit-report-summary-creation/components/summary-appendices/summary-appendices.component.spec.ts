import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAppendicesComponent } from './summary-appendices.component';

describe('SummaryAppendicesComponent', () => {
  let component: SummaryAppendicesComponent;
  let fixture: ComponentFixture<SummaryAppendicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryAppendicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryAppendicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
