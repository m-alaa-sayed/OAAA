import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMainDataComponent } from './request-main-data.component';

describe('RequestMainDataComponent', () => {
  let component: RequestMainDataComponent;
  let fixture: ComponentFixture<RequestMainDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestMainDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestMainDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
