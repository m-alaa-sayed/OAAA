import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendicesTabComponent } from './appendices-tab.component';

describe('AppendicesTabComponent', () => {
  let component: AppendicesTabComponent;
  let fixture: ComponentFixture<AppendicesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppendicesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppendicesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
