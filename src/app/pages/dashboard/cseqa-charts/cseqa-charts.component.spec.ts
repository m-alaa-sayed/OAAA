import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CseqaChartsComponent } from './cseqa-charts.component';

describe('CseqaChartsComponent', () => {
  let component: CseqaChartsComponent;
  let fixture: ComponentFixture<CseqaChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CseqaChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CseqaChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
