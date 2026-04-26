import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerFileManagementComponent } from './external-reviewer-file-management.component';

describe('ExternalReviewerFileManagementComponent', () => {
  let component: ExternalReviewerFileManagementComponent;
  let fixture: ComponentFixture<ExternalReviewerFileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerFileManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerFileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
