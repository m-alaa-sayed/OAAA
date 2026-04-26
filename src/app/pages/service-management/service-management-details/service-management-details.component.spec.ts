import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManagementDetailsComponent } from './service-management-details.component';

describe('ServiceManagementDetailsComponent', () => {
  let component: ServiceManagementDetailsComponent;
  let fixture: ComponentFixture<ServiceManagementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManagementDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManagementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
