import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OaaaqaAgGridComponent } from './oaaaqa-ag-grid.component';

describe('OaaaqaAgGridComponent', () => {
  let component: OaaaqaAgGridComponent;
  let fixture: ComponentFixture<OaaaqaAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OaaaqaAgGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OaaaqaAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
