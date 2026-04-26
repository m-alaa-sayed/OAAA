import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAppendicesTabComponent } from './summary-appendices-tab.component';

describe('SummaryAppendicesTabComponent', () => {
  let component: SummaryAppendicesTabComponent;
  let fixture: ComponentFixture<SummaryAppendicesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryAppendicesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryAppendicesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
