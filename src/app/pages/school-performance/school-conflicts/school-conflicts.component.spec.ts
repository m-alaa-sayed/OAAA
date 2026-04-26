import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolConflictsComponent } from './school-conflicts.component';

describe('SchoolConflictsComponent', () => {
  let component: SchoolConflictsComponent;
  let fixture: ComponentFixture<SchoolConflictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolConflictsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolConflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
