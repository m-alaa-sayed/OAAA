import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialCriteriaTabComponent } from './initial-criteria-tab.component';

describe('InitialCriteriaTabComponent', () => {
  let component: InitialCriteriaTabComponent;
  let fixture: ComponentFixture<InitialCriteriaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialCriteriaTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialCriteriaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
