import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsPlansOneBComponent } from './savings-plans-one-b.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('SavingsPlansOneBComponent', () => {
  let component: SavingsPlansOneBComponent;
  let fixture: ComponentFixture<SavingsPlansOneBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ SavingsPlansOneBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsPlansOneBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
