import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewersRegistrationTableComponent } from './external-reviewers-registration-table.component';

describe('ExternalReviewersRegistrationTableComponent', () => {
  let component: ExternalReviewersRegistrationTableComponent;
  let fixture: ComponentFixture<ExternalReviewersRegistrationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewersRegistrationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewersRegistrationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
