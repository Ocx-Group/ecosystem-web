import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyComponent } from './academy.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('AcademyComponent', () => {
  let component: AcademyComponent;
  let fixture: ComponentFixture<AcademyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ AcademyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
