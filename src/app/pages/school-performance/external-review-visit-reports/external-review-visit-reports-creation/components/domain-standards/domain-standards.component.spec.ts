import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainStandardsComponent } from './domain-standards.component';

describe('DomainStandardsComponent', () => {
  let component: DomainStandardsComponent;
  let fixture: ComponentFixture<DomainStandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainStandardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
