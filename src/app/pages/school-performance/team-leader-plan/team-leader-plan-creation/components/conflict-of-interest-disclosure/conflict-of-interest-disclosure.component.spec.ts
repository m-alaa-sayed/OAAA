import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictOfInterestDisclosureComponent } from './conflict-of-interest-disclosure.component';

describe('ConflictOfInterestDisclosureComponent', () => {
  let component: ConflictOfInterestDisclosureComponent;
  let fixture: ComponentFixture<ConflictOfInterestDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictOfInterestDisclosureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConflictOfInterestDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
