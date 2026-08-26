import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RightSidebarComponent } from './right-sidebar.component';
import { testImports, testProviders } from '@app/testing/testing';
describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [RightSidebarComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
