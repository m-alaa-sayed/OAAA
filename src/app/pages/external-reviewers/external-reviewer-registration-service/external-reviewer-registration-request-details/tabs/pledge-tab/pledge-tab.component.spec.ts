import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgeTabComponent } from './pledge-tab.component';

describe('PledgeTabComponent', () => {
  let component: PledgeTabComponent;
  let fixture: ComponentFixture<PledgeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PledgeTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PledgeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
