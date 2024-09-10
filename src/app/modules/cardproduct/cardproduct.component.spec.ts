/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardproductComponent } from './cardproduct.component';

describe('CardproductComponent', () => {
  let component: CardproductComponent;
  let fixture: ComponentFixture<CardproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
