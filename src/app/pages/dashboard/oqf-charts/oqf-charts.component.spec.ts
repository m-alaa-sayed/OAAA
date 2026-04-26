/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OQFChartsComponent } from './oqf-charts.component';

describe('OQFChartsComponent', () => {
  let component: OQFChartsComponent;
  let fixture: ComponentFixture<OQFChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OQFChartsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OQFChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
