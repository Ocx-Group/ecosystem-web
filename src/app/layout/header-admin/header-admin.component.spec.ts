import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderAdminComponent } from './header-admin.component';
import { testImports, testProviders } from '@app/testing/testing';
describe('HeaderComponent', () => {
  let component: HeaderAdminComponent;
  let fixture: ComponentFixture<HeaderAdminComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [HeaderAdminComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
