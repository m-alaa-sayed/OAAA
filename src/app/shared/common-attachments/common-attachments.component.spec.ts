import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonAttachmentsComponent } from './common-attachments.component';

describe('CommonAttachmentsComponent', () => {
  let component: CommonAttachmentsComponent;
  let fixture: ComponentFixture<CommonAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonAttachmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
