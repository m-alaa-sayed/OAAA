import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendicesComponent } from './appendices.component';

describe('AppendicesComponent', () => {
  let component: AppendicesComponent;
  let fixture: ComponentFixture<AppendicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppendicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
