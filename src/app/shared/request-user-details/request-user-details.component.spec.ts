import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUserDetailsComponent } from './request-user-details.component';

describe('RequestUserDetailsComponent', () => {
  let component: RequestUserDetailsComponent;
  let fixture: ComponentFixture<RequestUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
