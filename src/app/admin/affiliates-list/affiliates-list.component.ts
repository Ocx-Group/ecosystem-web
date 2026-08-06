
import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { PrintService } from '@app/core/service/print-service/print.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { CreditTransactionAdminRequest } from '@app/core/models/wallet-model/creditTransactionAdminRequest.mode';
import { BalanceInformationModalComponent } from './balance-information-modal/balance-information-modal.component';
import { WalletModel1AService } from '@app/core/service/wallet-model-1a-service/wallet-model-1a.service';
import { WalletModel1BService } from '@app/core/service/wallet-model-1b-service/wallet-model-1b.service';
import { PaginationRequest } from '@app/core/interfaces/pagination-request';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const header = [
  'Usuario',
  'Estado',
  'Teléfono',
  'Correo',
  'Fecha Registro',
  'Padre',
  'Patrocinador',
  'Patrocinador Binario',
];

@Component({
  selector: 'app-affiliates-list',
  templateUrl: './affiliates-list.component.html',
  providers: [ToastrService],
})
export class AffiliatesListComponent implements OnInit {
  rows = [];
  temp = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  totalElements = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';
  private readonly searchTerms = new Subject<string>();
  @ViewChild(BalanceInformationModalComponent) private balanceInformationModalComponent: BalanceInformationModalComponent;
  @ViewChild('table') table: DatatableComponent;

  constructor(
    private router: Router,
    private affiliateService: AffiliateService,
    private clipboardService: ClipboardService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private printService: PrintService,
    private walletService: WalletService,
    private walletModel1AService: WalletModel1AService,
    private walletModel1BService: WalletModel1BService
  ) { }

  ngOnInit() {
    this.searchTerms
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(term => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.loadAffiliateList();
      });

    this.loadAffiliateList();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }
  createOpenModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  closeModals() {
    this.modalService.dismissAll();
  }

  loadAffiliateList() {
    const request: PaginationRequest = {
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
      ...(this.searchTerm && { search: this.searchTerm }),
    };

    this.loadingIndicator = true;
    this.affiliateService.getAllPaged(request).subscribe({
      next: response => {
        if (response?.success && response.data) {
          this.rows = response.data.items;
          this.temp = response.data.items;
          this.totalElements = response.data.totalCount;
          this.pageSize = response.data.pageSize;
          this.currentPage = response.data.currentPage;
        }
        this.loadingIndicator = false;
      },
      error: error => {
        console.error(error);
        this.loadingIndicator = false;
        this.showError('Error al cargar los datos');
      },
    });
  }

  onPage(event: any) {
    this.currentPage = event.offset + 1;
    this.loadAffiliateList();
  }

  getRowHeight(row) {
    return row.height;
  }

  updateFilter(event) {
    this.searchTerms.next(event.target.value.trim());
  }

  formatStatusActivation(row: UserAffiliate) {
    return row.status_activation
      ? row.status_activation.replace(/_/g, ' ')
      : '';
  }

  clipBoardCopy() {
    var string = JSON.stringify(this.temp);
    var result = this.clipboardService.copyFromContent(string);

    if (this.temp != null) {
      this.toast.info('no data to copy');
    } else {
      this.toast.success('copied ' + this.temp.length + ' rows successfully');
    }
  }

  showSuccess(message: string) {
    this.toast.success(message);
  }

  showError(message: string) {
    this.toast.error(message);
  }

  onPrint() {
    const body = this.temp.map((items: UserAffiliate) => {
      const data = [
        items.user_name,
        items.status,
        items.phone,
        items.email,
        items.created_at,
        items.father_user_name,
        items.sponsor_user_name,
        items.binary_sponsor_user_name,
      ];
      return data;
    });

    this.printService.print(header, body, 'Lista de Afiliados', false);
  }

  onRouteUnilevelTree(id: number) {
    this.router.navigate([`admin/unilevel-tree/${id}`]);
  }

  onRouteForceGenealogicalTree() {
    this.router.navigate(['admin/force-genealogical-tree']);
  }

  onRouteBinaryGenealogicalTree(id: number) {
    this.router.navigate([`admin/binary-genealogical-tree/${id}`]);
  }

  confirmationCreateBalance(user: UserAffiliate) {
    Swal.fire({
      title: 'Acreditar Saldo',
      html: `
        <label id="swal-input-label" class="col-red">Usuario: ${user.user_name}</label>
        <br>
        <label for="swal-input-amount">Monto a Acreditar:</label>
        <input id="swal-input-amount" type="number" class="swal2-input" placeholder="Ingrese el monto">
        <br>
        <br>
        <label for="swal-select-type">Elija el saldo a crear:</label>
        <br>
        <br>
        <select id="swal-select-type" class="swal2-input">
          <option value="modelo2">Saldo Disponible Modelo2</option>
          <option value="modelo1a">Saldo Servicios Modelo1A</option>
          <option value="modelo1b">Saldo Servicios Modelo1B</option>
        </select>
      `,
      icon: 'info',
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const amount = (Swal.getPopup().querySelector('#swal-input-amount') as HTMLInputElement).value;
        const type = (Swal.getPopup().querySelector('#swal-select-type') as HTMLSelectElement).value;
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          Swal.showValidationMessage('Por favor ingrese un monto válido.');
          return false;
        }
        return {
          amount: Number(amount),
          type
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value !== false) {
        let creditRequest = new CreditTransactionAdminRequest();
        creditRequest.affiliateId = user.id;
        creditRequest.amount = result.value.amount;

        switch (result.value.type) {
          case 'modelo2':
            this.createAvailableBalance(creditRequest);
            break;
          case 'modelo1a':
            this.createServiceBalanceModel1A(creditRequest);
            break;
          case 'modelo1b':
            this.createServiceBalanceModel1B(creditRequest);
            break;
          default:
            console.error('Tipo de saldo desconocido:', result.value.type);
        }
      }
    });
  }

  createAvailableBalance(request: CreditTransactionAdminRequest) {
    this.walletService.createBalanceAdmin(request).subscribe({
      next: (value) => {
        if (value.success) {
          this.showSuccess('Se ha acreditado el saldo correctamente.');
        } else {
          this.showError('No se pudo crear la transacción');
        }
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  createServiceBalanceModel1A(request: CreditTransactionAdminRequest) {
    this.walletModel1AService.createServiceBalanceAdmin(request).subscribe({
      next: (value) => {
        if (value.success) {
          this.showSuccess('Se ha acreditado el saldo correctamente.');
        } else {
          this.showError('No se pudo crear la transacción');
        }
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  createServiceBalanceModel1B(request: CreditTransactionAdminRequest) {
    this.walletModel1BService.createServiceBalanceAdmin(request).subscribe({
      next: (value) => {
        if (value.success) {
          this.showSuccess('Se ha acreditado el saldo correctamente.');
        } else {
          this.showError('No se pudo crear la transacción');
        }
      },
      error: (err) => {
        this.showError('Error');
      },
    })
  }

  openBalanceInformationModal(userAffiliate: UserAffiliate) {
    if (this.balanceInformationModalComponent) {
      this.balanceInformationModalComponent.initModal(userAffiliate);
    }
  }
}
