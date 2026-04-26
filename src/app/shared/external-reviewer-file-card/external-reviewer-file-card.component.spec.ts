import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalReviewerFileCardComponent } from './external-reviewer-file-card.component';

describe('ExternalReviewerFileCardComponent', () => {
  let component: ExternalReviewerFileCardComponent;
  let fixture: ComponentFixture<ExternalReviewerFileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalReviewerFileCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalReviewerFileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
