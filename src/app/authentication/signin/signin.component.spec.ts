import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SigninComponent } from './signin.component';
import { testImports, testProviders } from '@app/testing/testing';
describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [SigninComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
