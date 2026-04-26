import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCkeditorComponent } from './custom-ckeditor.component';

describe('CustomCkeditorComponent', () => {
  let component: CustomCkeditorComponent;
  let fixture: ComponentFixture<CustomCkeditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCkeditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCkeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
