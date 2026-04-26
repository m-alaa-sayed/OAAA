import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReadingGuideComponent } from './report-reading-guide.component';

describe('ReportReadingGuideComponent', () => {
  let component: ReportReadingGuideComponent;
  let fixture: ComponentFixture<ReportReadingGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportReadingGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportReadingGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
