import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionRequestActionsComponent } from './deletion-request-actions.component';

describe('DeletionRequestActionsComponent', () => {
  let component: DeletionRequestActionsComponent;
  let fixture: ComponentFixture<DeletionRequestActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletionRequestActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletionRequestActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
