import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SidebarAdminComponent } from './sidebar-admin.component';
import { testImports, testProviders } from '@app/testing/testing';
describe('SidebarComponent', () => {
  let component: SidebarAdminComponent;
  let fixture: ComponentFixture<SidebarAdminComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [SidebarAdminComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
