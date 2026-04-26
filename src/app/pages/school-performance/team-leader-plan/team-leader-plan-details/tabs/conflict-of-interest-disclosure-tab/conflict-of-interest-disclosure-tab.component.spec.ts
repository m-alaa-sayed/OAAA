import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictOfInterestDisclosureTabComponent } from './conflict-of-interest-disclosure-tab.component';

describe('ConflictOfInterestDisclosureTabComponent', () => {
  let component: ConflictOfInterestDisclosureTabComponent;
  let fixture: ComponentFixture<ConflictOfInterestDisclosureTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictOfInterestDisclosureTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConflictOfInterestDisclosureTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
