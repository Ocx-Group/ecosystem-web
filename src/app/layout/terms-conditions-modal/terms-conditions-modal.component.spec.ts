import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionsModalComponent } from './terms-conditions-modal.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('TermsConditionsModalComponent', () => {
  let component: TermsConditionsModalComponent;
  let fixture: ComponentFixture<TermsConditionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ TermsConditionsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsConditionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
