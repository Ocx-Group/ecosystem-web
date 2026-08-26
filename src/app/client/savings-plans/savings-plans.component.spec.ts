
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SavingsPlansComponent } from './savings-plans.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('SavingsPlansComponent', () => {
  let component: SavingsPlansComponent;
  let fixture: ComponentFixture<SavingsPlansComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ SavingsPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingsPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
