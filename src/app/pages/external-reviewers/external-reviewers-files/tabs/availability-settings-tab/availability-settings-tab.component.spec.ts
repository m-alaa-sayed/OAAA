import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilitySettingsTabComponent } from './availability-settings-tab.component';

describe('AvailabilitySettingsTabComponent', () => {
  let component: AvailabilitySettingsTabComponent;
  let fixture: ComponentFixture<AvailabilitySettingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilitySettingsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilitySettingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
