import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolCommentsTabComponent } from './school-comments-tab.component';

describe('SchoolCommentsTabComponent', () => {
  let component: SchoolCommentsTabComponent;
  let fixture: ComponentFixture<SchoolCommentsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolCommentsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolCommentsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

