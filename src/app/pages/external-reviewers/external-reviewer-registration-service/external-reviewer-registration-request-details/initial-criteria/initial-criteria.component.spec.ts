import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialCriteriaComponent } from './initial-criteria.component';

describe('InitialCriteriaComponent', () => {
  let component: InitialCriteriaComponent;
  let fixture: ComponentFixture<InitialCriteriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialCriteriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
