import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReadingGuideTabComponent } from './report-reading-guide-tab.component';

describe('ReportReadingGuideTabComponent', () => {
  let component: ReportReadingGuideTabComponent;
  let fixture: ComponentFixture<ReportReadingGuideTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportReadingGuideTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReadingGuideTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
