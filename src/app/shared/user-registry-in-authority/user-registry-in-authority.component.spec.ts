import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRegistryInAuthorityComponent } from './user-registry-in-authority.component';

describe('UserRegistryInAuthorityComponent', () => {
  let component: UserRegistryInAuthorityComponent;
  let fixture: ComponentFixture<UserRegistryInAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRegistryInAuthorityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRegistryInAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
