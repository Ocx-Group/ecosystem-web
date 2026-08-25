import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalCoursesComponent } from './educational-courses.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('EducationalCoursesComponent', () => {
  let component: EducationalCoursesComponent;
  let fixture: ComponentFixture<EducationalCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ EducationalCoursesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
