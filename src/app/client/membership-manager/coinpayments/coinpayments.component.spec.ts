import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Product } from '@app/core/models/product-model/product.model';
import { CoinpaymentsComponent } from './coinpayments.component';

import { testImports, testProviders } from '@app/testing/testing';
describe('CoinpaymentsComponent', () => {
  let component: CoinpaymentsComponent;
  let fixture: ComponentFixture<CoinpaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...testImports],
      providers: [...testProviders],
      declarations: [ CoinpaymentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinpaymentsComponent);
    component = fixture.componentInstance;
    // El componente solo se usa con [membership] enlazado: ngAfterViewInit
    // arranca la transaccion y desreferencia el producto sin comprobarlo.
    component.membership = { id: 1 } as Product;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
