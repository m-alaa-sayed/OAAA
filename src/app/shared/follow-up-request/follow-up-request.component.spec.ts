import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpRequestComponent } from './follow-up-request.component';

describe('FollowUpRequestComponent', () => {
  let component: FollowUpRequestComponent;
  let fixture: ComponentFixture<FollowUpRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
