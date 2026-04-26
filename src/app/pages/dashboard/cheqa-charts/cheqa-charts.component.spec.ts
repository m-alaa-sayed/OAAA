/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CHEQAChartsComponent } from './cheqa-charts.component';

describe('CHEQAChartsComponent', () => {
  let component: CHEQAChartsComponent;
  let fixture: ComponentFixture<CHEQAChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CHEQAChartsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CHEQAChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
