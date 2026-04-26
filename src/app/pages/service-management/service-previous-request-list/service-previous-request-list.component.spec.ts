import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePreviousRequestListComponent } from './service-previous-request-list.component';

describe('PreviousRequestComponent', () => {
  let component: ServicePreviousRequestListComponent;
  let fixture: ComponentFixture<ServicePreviousRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePreviousRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePreviousRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
