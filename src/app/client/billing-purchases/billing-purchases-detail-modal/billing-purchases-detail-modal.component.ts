import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Invoice } from '@app/core/models/invoice-model/invoice.model';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'app-billing-purchases-detail-modal',
    templateUrl: './billing-purchases-detail-modal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BillingPurchasesDetailModalComponent implements OnInit, OnDestroy {
  private invoice: Invoice = new Invoice();
  private user: UserAffiliate = new UserAffiliate();
  countries = [];
  private suscription: Subscription;
  private destroy$ = new Subject();
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  Math = Math;

  @ViewChild('billingPurchasesDetailModal')
  billingPurchasesDetailModal: NgbModal;

  constructor(
    private modalService: NgbModal,
    private auth: AuthService,
    private affiliateService: AffiliateService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllCountries();
    this.getCurrentUser();

  }

  getAllCountries() {
    this.affiliateService.getCountries().subscribe({
      next: (resp) => {
        this.countries = resp;
        // La plantilla no nombra countries: interpola getCountryName(id), que lo
        // lee por dentro. Buscar el campo en el HTML no lo encuentra.
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error('error');
      },
    });
  }

  getCountryName(id: number) {
    let countryName = '';
    this.countries.find((item) => {
      if (item.id === id) {
        countryName = item.name;
        return true;
      }
    })

    return countryName;
  }

  getCurrentUser() {
    this.suscription = this.auth.currentUserAffiliate
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.suscription.unsubscribe();
  }

  billingPurchasesOpenModal(content, invoice: Invoice) {
    this.totalDiscount = invoice.invoicesDetails[0].productDiscount;
    this.totalTax = invoice.invoicesDetails[0].productIva;
    const subTotal = invoice.invoicesDetails.reduce((accumulator, item) => {
      return accumulator + (item.productPrice * item.productQuantity);
    }, 0);


    this.subTotal = subTotal;


    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      centered: true,
    });
    this.invoice = invoice;
    // Al modal lo abre el padre desde su plantilla: ese click ensucia la
    // vista del PADRE, no la de este componente.
    this.cdr.markForCheck();
  }
}
